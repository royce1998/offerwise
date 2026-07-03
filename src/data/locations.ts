// Cost-of-living index: 100 = U.S. national average.
// stateTax = approximate *effective* state income tax rate for a ~$200k earner.
// Sources: public COL indices + state tax schedules (approximations, for guidance only).

export interface Location {
  id: string;
  label: string;
  col: number;
  stateTax: number;
}

export const LOCATIONS: Location[] = [
  { id: "remote-us", label: "Remote (US average)", col: 100, stateTax: 0.04 },
  { id: "sf", label: "San Francisco, CA", col: 192, stateTax: 0.093 },
  { id: "sanjose", label: "San Jose / South Bay, CA", col: 187, stateTax: 0.093 },
  { id: "nyc", label: "New York City, NY", col: 178, stateTax: 0.065 },
  { id: "seattle", label: "Seattle, WA", col: 152, stateTax: 0.0 },
  { id: "boston", label: "Boston, MA", col: 150, stateTax: 0.05 },
  { id: "la", label: "Los Angeles, CA", col: 146, stateTax: 0.093 },
  { id: "sandiego", label: "San Diego, CA", col: 142, stateTax: 0.093 },
  { id: "dc", label: "Washington, DC", col: 138, stateTax: 0.085 },
  { id: "boulder", label: "Denver / Boulder, CO", col: 122, stateTax: 0.044 },
  { id: "portland", label: "Portland, OR", col: 128, stateTax: 0.099 },
  { id: "chicago", label: "Chicago, IL", col: 120, stateTax: 0.0495 },
  { id: "austin", label: "Austin, TX", col: 108, stateTax: 0.0 },
  { id: "dallas", label: "Dallas, TX", col: 103, stateTax: 0.0 },
  { id: "atlanta", label: "Atlanta, GA", col: 104, stateTax: 0.0549 },
  { id: "raleigh", label: "Raleigh / RTP, NC", col: 100, stateTax: 0.045 },
  { id: "miami", label: "Miami, FL", col: 118, stateTax: 0.0 },
  { id: "phoenix", label: "Phoenix, AZ", col: 105, stateTax: 0.025 },
  { id: "salt-lake", label: "Salt Lake City, UT", col: 108, stateTax: 0.0465 },
  { id: "nashville", label: "Nashville, TN", col: 106, stateTax: 0.0 },
  { id: "pittsburgh", label: "Pittsburgh, PA", col: 95, stateTax: 0.0307 },
  { id: "london", label: "London, UK", col: 165, stateTax: 0.0 },
  { id: "toronto", label: "Toronto, CA 🇨🇦", col: 128, stateTax: 0.0 },
  { id: "bangalore", label: "Bangalore, IN", col: 45, stateTax: 0.0 },
];

export function getLocation(id: string): Location {
  return LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0];
}
