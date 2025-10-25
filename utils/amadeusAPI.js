import Amadeus from "amadeus";
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});
export async function searchFlights(from, to, departure, ret, passengers, travelClass = "ECONOMY") {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: departure,
      returnDate: ret || undefined,
      adults: passengers,
      travelClass,
      currencyCode: "EUR",
      max: 10
    });
    return response.data.map(f => {
      const segments = f.itineraries.flatMap(it => it.segments.map(s => `${s.departure.iataCode}→${s.arrival.iataCode}`));
      const marketingAirlines = [...new Set(f.itineraries.flatMap(it => it.segments.map(s => s.marketingCarrier)))];
      return { airline: f.validatingAirlineCodes.join(", "), marketingAirlines, from, to, price: parseFloat(f.price.total), currency: f.price.currency, cabin: travelClass, route: segments.join(" → ") };
    });
  } catch (err) {
    console.error(`Amadeus API error for ${travelClass}:`, err);
    return [];
  }
}
