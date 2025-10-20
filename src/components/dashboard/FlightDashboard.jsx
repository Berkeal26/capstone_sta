import React from 'react';
import { FlightMap } from './FlightMap';
import { PriceChart } from './PriceChart';
import { FlightsTable } from './FlightsTable';
import { ScrollArea } from '../ui/scroll-area';

// Mock data for demonstration - this will be replaced with real Amadeus API data
const priceData = [
  { date: 'Oct 20', price: 450, optimal: 380 },
  { date: 'Oct 21', price: 420, optimal: 380 },
  { date: 'Oct 22', price: 390, optimal: 380 },
  { date: 'Oct 23', price: 380, optimal: 380 },
  { date: 'Oct 24', price: 410, optimal: 380 },
  { date: 'Oct 25', price: 480, optimal: 380 },
  { date: 'Oct 26', price: 520, optimal: 380 },
];

const flightsData = [
  {
    id: '1',
    airline: 'Delta Airlines',
    flightNumber: 'DL 1234',
    departure: '08:00 AM',
    arrival: '11:30 AM',
    duration: '3h 30m',
    price: 380,
    isOptimal: true,
    stops: 0,
  },
  {
    id: '2',
    airline: 'United Airlines',
    flightNumber: 'UA 5678',
    departure: '10:15 AM',
    arrival: '02:00 PM',
    duration: '3h 45m',
    price: 395,
    isOptimal: true,
    stops: 0,
  },
  {
    id: '3',
    airline: 'American Airlines',
    flightNumber: 'AA 9012',
    departure: '01:30 PM',
    arrival: '05:15 PM',
    duration: '3h 45m',
    price: 420,
    isOptimal: false,
    stops: 0,
  },
  {
    id: '4',
    airline: 'Southwest Airlines',
    flightNumber: 'WN 3456',
    departure: '06:00 AM',
    arrival: '11:45 AM',
    duration: '5h 45m',
    price: 310,
    isOptimal: true,
    stops: 1,
  },
  {
    id: '5',
    airline: 'JetBlue Airways',
    flightNumber: 'B6 7890',
    departure: '03:00 PM',
    arrival: '06:45 PM',
    duration: '3h 45m',
    price: 450,
    isOptimal: false,
    stops: 0,
  },
  {
    id: '6',
    airline: 'Spirit Airlines',
    flightNumber: 'NK 2345',
    departure: '07:30 AM',
    arrival: '01:30 PM',
    duration: '6h 00m',
    price: 290,
    isOptimal: false,
    stops: 1,
  },
];

export function FlightDashboard({ searchData = null }) {
  // Debug logging
  console.log('FlightDashboard received searchData:', searchData);
  
  // Use real data if provided, otherwise use mock data
  const hasRealData = searchData?.hasRealData || false;
  const displayPriceData = searchData?.priceData?.length > 0 ? searchData.priceData : priceData;
  const displayFlightsData = searchData?.flights?.length > 0 ? searchData.flights : flightsData;
  const routeInfo = searchData?.route || {
    departure: 'New York',
    destination: 'Los Angeles',
    departureCode: 'JFK',
    destinationCode: 'LAX',
    date: 'Oct 23, 2025'
  };
  
  console.log('FlightDashboard using data:', {
    hasRealData,
    priceDataLength: displayPriceData.length,
    flightsDataLength: displayFlightsData.length,
    routeInfo
  });

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Flight Search Results</h2>
          <p className="text-muted-foreground">
            {routeInfo.departure} ({routeInfo.departureCode}) → {routeInfo.destination} ({routeInfo.destinationCode}) • {routeInfo.date}
          </p>
        </div>

        {/* Flight Map Animation */}
        <FlightMap
          key={`flight-map-${routeInfo.departureCode}-${routeInfo.destinationCode}`}
          departure={routeInfo.departure}
          destination={routeInfo.destination}
          departureCode={routeInfo.departureCode}
          destinationCode={routeInfo.destinationCode}
        />

        {/* Price Chart */}
        <PriceChart key={`price-chart-${displayPriceData[0]?.date}-${displayPriceData[0]?.price}`} data={displayPriceData} />

        {/* Flights Table */}
        <FlightsTable key={`flights-table-${displayFlightsData[0]?.id}-${displayFlightsData[0]?.price}`} flights={displayFlightsData} />
      </div>
    </ScrollArea>
  );
}
