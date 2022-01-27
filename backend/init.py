#!/usr/bin/env python3
import init_providers
import init_stations
import init_vehicles
import init_passes

#Initialize database
init_providers.init_providers()#Insert providers into the database.
init_stations.init_stations(['','sampledata01/sampledata01_stations.csv'])#Insert stations into the database.
init_vehicles.init_vehicles(['','./sampledata01/sampledata01_vehicles_100.csv'])#Insert vehicles into the database.
init_passes.init_passes()#Insert passes in the database.
