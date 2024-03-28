import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as admin from 'firebase-admin';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(@Inject('MONGO_SERVICE') private mongoService: ClientProxy) {}

  /**
   * Get all ongoing searchs from microservice Mongo to proceed search on communauto API
   */
  async getSearchs() {
    const s = await lastValueFrom(
      this.mongoService.send({ cmd: 'get_all_searchs' }, {}),
    );
    return s;
  }

  async verifyDate(search) {
    const fromDate = new Date(search.from);
    let diff = new Date().getTime() - fromDate.getTime();
    if (diff > 0) {
      await lastValueFrom(
        this.mongoService.send(
          { cmd: 'set_state_search' },
          { search: search, state: 'error' },
        ),
      );
      throw 'Date passed';
    }
    return;
  }

  /***
   * Call communauto API to get all station available on this sector and date
   */
  async getAllStationForSearch(search): Promise<any[]> {
    const request = await fetch(
      `https://restapifrontoffice.reservauto.net/api/v2/StationAvailability?CityId=59&MaxLatitude=${
        search.sector.maxLatitude
      }&MinLatitude=${search.sector.minLatitude}&MaxLongitude=${
        search.sector.maxLongitude
      }&MinLongitude=${search.sector.minLongitude}&StartDate=${encodeURIComponent(
        search.from,
      )}&EndDate=${encodeURIComponent(search.to)}`,
    );
    const response = await request.json();

    if (!response.stations) {
      throw 'No station available';
    }
    return response.stations;
  }

  /**
   *  Check all stations to see if a vehicle is available for the date
   * @param stations list of stations
   */
  async checkVehicles(stations: any[]) {
    const station = stations.find((s) => s.recommendedVehicleId);
    if (station) {
      return station;
    }
    console.log('No vehicle available');
    throw 'No vehicule found at this time';
  }

  /**
   *  Notity User that we found a vehicule with a push notification, and update the state of the search with done
   * @param station station with the vehicle available
   * @param search the current search
   */
  async notifyUser(search) {
    admin
      .messaging()
      .send({
        token: search.tokenFCM,
        webpush: {
          notification: {
            title: "J'ai trouvé une voiture !",
            body: `Voiture trouvé à ${search.sector.name} du ${search.from} au ${search.to}`,
          },
        },
      })
      .then((response) => {
        console.log('notification.send.success:' + JSON.stringify(response));
      })
      .catch((error) => {
        console.log('notification.send.error:' + JSON.stringify(error));
      });
  }

  async processingSearch() {
    const searchs = await this.getSearchs();
    if (!searchs.length) {
      return;
    } else {
      searchs.forEach(async (s) => {
        try {
          await this.verifyDate(s);
          const stations = await this.getAllStationForSearch(s);
          const station = await this.checkVehicles(stations);
          await this.notifyUser(s);
          await lastValueFrom(
            this.mongoService.send(
              { cmd: 'set_state_search' },
              { search: s, state: 'done' },
            ),
          );
        } catch (ex) {
          console.error('EXCEPTION', ex);
        }
      });
      return searchs.length;
    }
  }
}
