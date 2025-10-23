"""
IATA Code Lookup for Common Cities
Provides fast lookup for city names to IATA codes to reduce API calls
"""
from typing import Dict, Optional

# Common city to IATA code mappings
COMMON_IATA_CODES: Dict[str, str] = {
    # Major cities
    "paris": "PAR",
    "tokyo": "TYO", 
    "london": "LON",
    "new york": "NYC",
    "new york city": "NYC",
    "nyc": "NYC",
    "washington dc": "DCA",
    "washington": "DCA",
    "dc": "DCA",
    "los angeles": "LAX",
    "chicago": "CHI",
    "miami": "MIA",
    "boston": "BOS",
    "san francisco": "SFO",
    "seattle": "SEA",
    "toronto": "YYZ",
    "vancouver": "YVR",
    "montreal": "YUL",
    
    # European cities
    "berlin": "BER",
    "munich": "MUC",
    "frankfurt": "FRA",
    "rome": "FCO",
    "milan": "MXP",
    "madrid": "MAD",
    "barcelona": "BCN",
    "amsterdam": "AMS",
    "brussels": "BRU",
    "zurich": "ZUR",
    "vienna": "VIE",
    "prague": "PRG",
    "warsaw": "WAW",
    "moscow": "SVO",
    "istanbul": "IST",
    "athens": "ATH",
    "lisbon": "LIS",
    "dublin": "DUB",
    "copenhagen": "CPH",
    "stockholm": "ARN",
    "oslo": "OSL",
    "helsinki": "HEL",
    
    # Asian cities
    "beijing": "PEK",
    "shanghai": "PVG",
    "hong kong": "HKG",
    "singapore": "SIN",
    "bangkok": "BKK",
    "kuala lumpur": "KUL",
    "jakarta": "CGK",
    "manila": "MNL",
    "seoul": "ICN",
    "busan": "PUS",
    "taipei": "TPE",
    "mumbai": "BOM",
    "delhi": "DEL",
    "bangalore": "BLR",
    "chennai": "MAA",
    "kolkata": "CCU",
    "hyderabad": "HYD",
    "pune": "PNQ",
    "ahmedabad": "AMD",
    "kochi": "COK",
    "goa": "GOI",
    
    # Middle East & Africa
    "dubai": "DXB",
    "abu dhabi": "AUH",
    "doha": "DOH",
    "riyadh": "RUH",
    "jeddah": "JED",
    "cairo": "CAI",
    "casablanca": "CMN",
    "johannesburg": "JNB",
    "cape town": "CPT",
    "nairobi": "NBO",
    "lagos": "LOS",
    "accra": "ACC",
    
    # South America
    "sao paulo": "GRU",
    "rio de janeiro": "GIG",
    "buenos aires": "EZE",
    "santiago": "SCL",
    "lima": "LIM",
    "bogota": "BOG",
    "caracas": "CCS",
    "mexico city": "MEX",
    "guadalajara": "GDL",
    "cancun": "CUN",
    
    # Australia & Pacific
    "sydney": "SYD",
    "melbourne": "MEL",
    "brisbane": "BNE",
    "perth": "PER",
    "adelaide": "ADL",
    "auckland": "AKL",
    "wellington": "WLG",
    "fiji": "NAN",
    "honolulu": "HNL",
    
    # Additional major airports
    "atlanta": "ATL",
    "dallas": "DFW",
    "denver": "DEN",
    "las vegas": "LAS",
    "phoenix": "PHX",
    "orlando": "MCO",
    "tampa": "TPA",
    "detroit": "DTW",
    "minneapolis": "MSP",
    "cleveland": "CLE",
    "pittsburgh": "PIT",
    "charlotte": "CLT",
    "raleigh": "RDU",
    "nashville": "BNA",
    "memphis": "MEM",
    "new orleans": "MSY",
    "houston": "IAH",
    "austin": "AUS",
    "san antonio": "SAT",
    "dallas": "DAL",
    "fort worth": "DFW",
    "kansas city": "MCI",
    "st louis": "STL",
    "indianapolis": "IND",
    "columbus": "CMH",
    "cincinnati": "CVG",
    "louisville": "SDF",
    "lexington": "LEX",
    "knoxville": "TYS",
    "chattanooga": "CHA",
    "birmingham": "BHM",
    "mobile": "MOB",
    "pensacola": "PNS",
    "tallahassee": "TLH",
    "gainesville": "GNV",
    "jacksonville": "JAX",
    "savannah": "SAV",
    "charleston": "CHS",
    "columbia": "CAE",
    "greenville": "GSP",
    "asheville": "AVL",
    "wilmington": "ILM",
    "fayetteville": "FAY",
    "greensboro": "GSO",
    "winston salem": "INT",
    "norfolk": "ORF",
    "richmond": "RIC",
    "newport news": "PHF",
    "roanoke": "ROA",
    "lynchburg": "LYH",
    "charlottesville": "CHO",
    "harrisonburg": "SHD",
    "blacksburg": "BCB",
    "radford": "RAD",
    "virginia beach": "ORF",
    "chesapeake": "ORF",
    "portsmouth": "ORF",
    "suffolk": "ORF",
    "hampton": "ORF",
    "newport news": "PHF",
    "williamsburg": "PHF",
    "yorktown": "PHF",
    "gloucester": "PHF",
    "mathews": "PHF",
    "middlesex": "PHF",
    "king and queen": "PHF",
    "king william": "PHF",
    "new kent": "PHF",
    "charles city": "PHF",
    "james city": "PHF",
    "york": "PHF",
    "poquoson": "PHF",
    "surry": "PHF",
    "sussex": "PHF",
    "southampton": "PHF",
    "isle of wight": "PHF",
    "franklin": "PHF",
    "suffolk": "ORF",
    "chesapeake": "ORF",
    "portsmouth": "ORF",
    "norfolk": "ORF",
    "virginia beach": "ORF",
    "hampton": "ORF",
    "newport news": "PHF",
    "williamsburg": "PHF",
    "yorktown": "PHF",
    "gloucester": "PHF",
    "mathews": "PHF",
    "middlesex": "PHF",
    "king and queen": "PHF",
    "king william": "PHF",
    "new kent": "PHF",
    "charles city": "PHF",
    "james city": "PHF",
    "york": "PHF",
    "poquoson": "PHF",
    "surry": "PHF",
    "sussex": "PHF",
    "southampton": "PHF",
    "isle of wight": "PHF",
    "franklin": "PHF"
}

def get_iata_code(city_name: str) -> Optional[str]:
    """
    Get IATA code for a city name
    
    Args:
        city_name: City name (case insensitive)
        
    Returns:
        IATA code if found, None otherwise
    """
    if not city_name:
        return None
    
    # Normalize city name
    normalized = city_name.lower().strip()
    
    # Direct lookup
    if normalized in COMMON_IATA_CODES:
        return COMMON_IATA_CODES[normalized]
    
    # Try partial matches for common patterns
    for city, code in COMMON_IATA_CODES.items():
        if normalized in city or city in normalized:
            return code
    
    return None

def get_airport_codes(city_name: str) -> list:
    """
    Get all possible airport codes for a city
    
    Args:
        city_name: City name
        
    Returns:
        List of IATA codes
    """
    iata_code = get_iata_code(city_name)
    if iata_code:
        return [iata_code]
    return []
