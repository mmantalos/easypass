#!/usr/bin/env python3
import init_providers
import init_stations
import init_vehicles
import init_passes
import os

dir = os.path.dirname(__file__)
#Initialize database
init_providers.init_providers()#Insert providers into the database.
init_stations.init_stations(['', dir + '/sampledata01/sampledata01_stations.csv'])#Insert stations into the database.
init_vehicles.init_vehicles(['', dir + '/sampledata01/sampledata01_vehicles_100.csv'])#Insert vehicles into the database.
init_passes.init_passes(dir + '/sampledata01/sampledata01_passes100_8000.csv')#Insert passes in the database.