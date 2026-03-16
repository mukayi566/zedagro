// =========================================================
// ZEDAGRO - Mock Data & Type Definitions
// =========================================================

export type UserRole = "admin" | "agent" | "farmer" | "agrodealer";

export interface Farmer {
    id: string;
    zedId: string;
    name: string;
    nrc: string;
    phone: string;
    district: string;
    province: string;
    farmSize: number;
    verifiedSize: number;
    status: "drone_verified" | "pending_survey" | "flagged" | "active";
    crops: string[];
    lat: number;
    lng: number;
    registeredDate: string;
    biometricVerified: boolean;
    photo?: string;
}

export interface FISPVoucher {
    id: string;
    voucherId: string;
    farmerId: string;
    farmerName: string;
    district: string;
    items: { name: string; qty: number; unit: string }[];
    status: "issued" | "redeemed" | "expired" | "revoked";
    issuedDate: string;
    redeemedDate?: string;
    agroDealer?: string;
    season: string;
}

export interface Payment {
    id: string;
    farmerId: string;
    farmerName: string;
    amount: number;
    produce: string;
    quantity: number;
    unitPrice: number;
    method: "mobile_money" | "bank" | "wallet";
    provider?: string;
    status: "pending" | "processing" | "completed" | "failed";
    date: string;
    transactionRef: string;
}

export interface LogisticsTrip {
    id: number;
    truckId?: string;
    driver?: string;
    fieldAgentId?: string;
    driverId?: string;
    farmerId?: string;
    farmerName: string;
    origin: string;
    destination: string;
    produce: string;
    weight: number;
    status: "ready" | "assigned" | "loading" | "in_transit" | "arrived" | "delivered";
    scheduledDate: string;
    progress: number;
    eta?: string;
}

export interface StorageDepot {
    id: string;
    name: string;
    location: string;
    capacity: number;
    used: number;
    province: string;
}

export interface FraudAlert {
    id: string;
    farmerId: string;
    farmerName: string;
    zedId: string;
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    date: string;
    status: "open" | "investigating" | "resolved";
}

// =========================================================
// FARMERS DATA
// =========================================================
export const farmers: Farmer[] = [
    {
        id: "1",
        zedId: "ZED-882931",
        name: "Mubanga Kalunga",
        nrc: "443212/11/1",
        phone: "+260 977 123 456",
        district: "Lusaka West",
        province: "Lusaka",
        farmSize: 5.0,
        verifiedSize: 4.2,
        status: "drone_verified",
        crops: ["Maize", "Soya"],
        lat: -15.4167,
        lng: 28.2833,
        registeredDate: "2025-03-12",
        biometricVerified: true,
    },
    {
        id: "2",
        zedId: "ZED-554021",
        name: "Kelvin Phiri",
        nrc: "112039/10/1",
        phone: "+260 955 345 678",
        district: "Ndola",
        province: "Copperbelt",
        farmSize: 3.5,
        verifiedSize: 3.5,
        status: "pending_survey",
        crops: ["Maize"],
        lat: -12.9708,
        lng: 28.6366,
        registeredDate: "2025-04-22",
        biometricVerified: true,
    },
    {
        id: "3",
        zedId: "ZED-119203",
        name: "Chipo Mumba",
        nrc: "998231/43/1",
        phone: "+260 966 234 567",
        district: "Choma",
        province: "Southern",
        farmSize: 8.0,
        verifiedSize: 5.1,
        status: "flagged",
        crops: ["Sunflower", "Soya"],
        lat: -16.8167,
        lng: 27.0667,
        registeredDate: "2025-02-14",
        biometricVerified: false,
    },
    {
        id: "4",
        zedId: "ZED-334502",
        name: "Patrick Banda",
        nrc: "221390/21/1",
        phone: "+260 971 987 654",
        district: "Chipata",
        province: "Eastern",
        farmSize: 12.0,
        verifiedSize: 11.8,
        status: "drone_verified",
        crops: ["Maize", "Cotton"],
        lat: -13.6381,
        lng: 32.6444,
        registeredDate: "2025-01-30",
        biometricVerified: true,
    },
    {
        id: "5",
        zedId: "ZED-773122",
        name: "Grace Mwanza",
        nrc: "556712/33/1",
        phone: "+260 977 555 111",
        district: "Kabwe",
        province: "Central",
        farmSize: 15.0,
        verifiedSize: 12.5,
        status: "flagged",
        crops: ["Wheat", "Maize"],
        lat: -14.4469,
        lng: 28.446,
        registeredDate: "2024-12-05",
        biometricVerified: true,
    },
    {
        id: "6",
        zedId: "ZED-991423",
        name: "Charles Mwape",
        nrc: "879234/12/1",
        phone: "+260 955 221 334",
        district: "Kasama",
        province: "Northern",
        farmSize: 6.5,
        verifiedSize: 6.5,
        status: "drone_verified",
        crops: ["Cassava", "Beans"],
        lat: -10.2077,
        lng: 31.1809,
        registeredDate: "2025-05-01",
        biometricVerified: true,
    },
];

// =========================================================
// FISP VOUCHERS DATA
// =========================================================
export const vouchers: FISPVoucher[] = [
    {
        id: "1",
        voucherId: "FISP-9921",
        farmerId: "1",
        farmerName: "Banda Kelvin",
        district: "Lusaka District",
        items: [
            { name: "Urea Fertilizer", qty: 2, unit: "50kg bags" },
            { name: "Hybrid Maize Seed", qty: 1, unit: "10kg pack" },
        ],
        status: "redeemed",
        issuedDate: "2025-11-12",
        redeemedDate: "2026-03-08",
        agroDealer: "Lusaka West Agrostore",
        season: "2026",
    },
    {
        id: "2",
        voucherId: "FISP-9876",
        farmerId: "2",
        farmerName: "Mary Phiri",
        district: "Chilanga District",
        items: [
            { name: "D-Compound", qty: 2, unit: "50kg bags" },
            { name: "Hybrid Maize Seed", qty: 1, unit: "10kg pack" },
        ],
        status: "redeemed",
        issuedDate: "2025-11-10",
        redeemedDate: "2026-03-08",
        agroDealer: "Chilanga Main Agro",
        season: "2026",
    },
    {
        id: "3",
        voucherId: "FISP-9442",
        farmerId: "3",
        farmerName: "John Zulu",
        district: "Kafue District",
        items: [
            { name: "Urea Fertilizer", qty: 1, unit: "50kg bag" },
            { name: "Soya Seed", qty: 1, unit: "20kg pack" },
        ],
        status: "redeemed",
        issuedDate: "2025-11-01",
        redeemedDate: "2026-03-07",
        agroDealer: "Kafue AgroDealer",
        season: "2026",
    },
    {
        id: "4",
        voucherId: "FISP-8811",
        farmerId: "4",
        farmerName: "Chanda Musonda",
        district: "Chipata East",
        items: [
            { name: "Urea Fertilizer", qty: 3, unit: "50kg bags" },
            { name: "Hybrid Maize Seed", qty: 2, unit: "10kg packs" },
        ],
        status: "issued",
        issuedDate: "2025-11-20",
        season: "2026",
    },
    {
        id: "5",
        voucherId: "FISP-7723",
        farmerId: "5",
        farmerName: "Grace Mwanza",
        district: "Kabwe Central",
        items: [
            { name: "D-Compound", qty: 4, unit: "50kg bags" },
            { name: "Wheat Seed", qty: 2, unit: "25kg packs" },
        ],
        status: "issued",
        issuedDate: "2025-12-01",
        season: "2026",
    },
];

// =========================================================
// PAYMENTS DATA
// =========================================================
export const payments: Payment[] = [
    {
        id: "1",
        farmerId: "1",
        farmerName: "Mubanga Kalunga",
        amount: 18750,
        produce: "Maize",
        quantity: 2500,
        unitPrice: 7.5,
        method: "mobile_money",
        provider: "MTN MoMo",
        status: "completed",
        date: "2026-03-06",
        transactionRef: "MTN-20263060001",
    },
    {
        id: "2",
        farmerId: "2",
        farmerName: "Kelvin Phiri",
        amount: 24500,
        produce: "Soya",
        quantity: 1750,
        unitPrice: 14.0,
        method: "bank",
        provider: "Zanaco Bank",
        status: "completed",
        date: "2026-03-05",
        transactionRef: "ZNC-20263050042",
    },
    {
        id: "3",
        farmerId: "4",
        farmerName: "Patrick Banda",
        amount: 42000,
        produce: "Maize",
        quantity: 6000,
        unitPrice: 7.0,
        method: "mobile_money",
        provider: "Airtel Money",
        status: "processing",
        date: "2026-03-07",
        transactionRef: "AM-20263070018",
    },
    {
        id: "4",
        farmerId: "6",
        farmerName: "Charles Mwape",
        amount: 11200,
        produce: "Beans",
        quantity: 800,
        unitPrice: 14.0,
        method: "mobile_money",
        provider: "MTN MoMo",
        status: "pending",
        date: "2026-03-08",
        transactionRef: "MTN-20263080009",
    },
    {
        id: "5",
        farmerId: "5",
        farmerName: "Grace Mwanza",
        amount: 67500,
        produce: "Wheat",
        quantity: 4500,
        unitPrice: 15.0,
        method: "bank",
        provider: "First Capital Bank",
        status: "failed",
        date: "2026-03-04",
        transactionRef: "FCB-20263040033",
    },
];

// =========================================================
// LOGISTICS DATA
// =========================================================
export const logisticsTrips: LogisticsTrip[] = [
    {
        id: 1,
        truckId: "TRK-882",
        driver: "Chanda Musonda",
        farmerId: "farmer_88",
        farmerName: "Mwape Farms Ltd",
        origin: "Farm (Mansa)",
        destination: "FRA Storage (Ndola)",
        produce: "Soya",
        weight: 12,
        status: "in_transit",
        scheduledDate: "2026-03-08",
        progress: 65,
        eta: "2h 15m",
    },
    {
        id: 2,
        truckId: "TRK-410",
        driver: "Kelvin Phiri",
        farmerId: "farmer_55",
        farmerName: "Green Valley Co-op",
        origin: "Farm (Mazabuka)",
        destination: "FRA Storage (Lusaka)",
        produce: "Maize",
        weight: 18,
        status: "in_transit",
        scheduledDate: "2026-03-08",
        progress: 32,
        eta: "5h 40m",
    },
    {
        id: 3,
        truckId: "TRK-902",
        driver: "Sarah Zulu",
        farmerId: "farmer_22",
        farmerName: "Kalomo Smallholders",
        origin: "Farm (Kalomo)",
        destination: "FRA Storage (Choma)",
        produce: "Maize",
        weight: 15,
        status: "assigned",
        scheduledDate: "2026-03-09",
        progress: 0,
    },
    {
        id: 4,
        farmerId: "farmer_01",
        farmerName: "Eastern Cooperative",
        origin: "Farm (Chipata)",
        destination: "FRA Storage (Chipata)",
        produce: "Cotton",
        weight: 8,
        status: "ready",
        scheduledDate: "2026-03-09",
        progress: 0,
    },
    {
        id: 5,
        truckId: "TRK-554",
        driver: "Alice Phiri",
        farmerId: "farmer_12",
        farmerName: "Kabwe Growers",
        origin: "Farm (Kabwe)",
        destination: "FRA Storage (Lusaka)",
        produce: "Wheat",
        weight: 22,
        status: "delivered",
        scheduledDate: "2026-03-07",
        progress: 100,
    },
];

// =========================================================
// STORAGE DEPOTS
// =========================================================
export const storageDepots: StorageDepot[] = [
    { id: "1", name: "Lusaka Central", location: "Lusaka", capacity: 50000, used: 42500, province: "Lusaka" },
    { id: "2", name: "Ndola Regional", location: "Ndola", capacity: 35000, used: 21000, province: "Copperbelt" },
    { id: "3", name: "Chipata East", location: "Chipata", capacity: 25000, used: 8000, province: "Eastern" },
    { id: "4", name: "Kasama North", location: "Kasama", capacity: 20000, used: 9000, province: "Northern" },
    { id: "5", name: "Choma Southern", location: "Choma", capacity: 30000, used: 18000, province: "Southern" },
];

// =========================================================
// FRAUD ALERTS
// =========================================================
export const fraudAlerts: FraudAlert[] = [
    {
        id: "1",
        farmerId: "5",
        farmerName: "Grace Mwanza",
        zedId: "ZED-773122",
        type: "Farm Size Discrepancy",
        severity: "critical",
        description: "Claimed farm size (15.0 Ha) exceeds drone-verified size (12.5 Ha) by 16.7%. Possible fraud.",
        date: "2026-03-07",
        status: "investigating",
    },
    {
        id: "2",
        farmerId: "3",
        farmerName: "Chipo Mumba",
        zedId: "ZED-119203",
        type: "Duplicate NRC Detected",
        severity: "high",
        description: "NRC number 998231/43/1 appears linked to two different farmer profiles.",
        date: "2026-03-06",
        status: "open",
    },
    {
        id: "3",
        farmerId: "2",
        farmerName: "Kelvin Phiri",
        zedId: "ZED-554021",
        type: "Double Voucher Attempt",
        severity: "medium",
        description: "Farmer attempted to redeem FISP voucher at two different agrodealers on the same day.",
        date: "2026-03-05",
        status: "resolved",
    },
];

// =========================================================
// ANALYTICS DATA
// =========================================================
export const registrationGrowth = [
    { month: "Sep", farmers: 980000 },
    { month: "Oct", farmers: 1050000 },
    { month: "Nov", farmers: 1080000 },
    { month: "Dec", farmers: 1120000 },
    { month: "Jan", farmers: 1160000 },
    { month: "Feb", farmers: 1210000 },
    { month: "Mar", farmers: 1240500 },
];

export const produceByRegion = [
    { region: "Central", maize: 2100, soya: 1200, wheat: 800 },
    { region: "Copperbelt", maize: 1200, soya: 600, wheat: 100 },
    { region: "Eastern", maize: 1800, soya: 900, wheat: 50 },
    { region: "Lusaka", maize: 940, soya: 450, wheat: 200 },
    { region: "Northern", maize: 750, soya: 300, wheat: 20 },
    { region: "Southern", maize: 1100, soya: 800, wheat: 400 },
];

export const paymentMethodBreakdown = [
    { name: "MTN MoMo", value: 45, color: "#FFCB05" },
    { name: "Airtel Money", value: 28, color: "#FF0000" },
    { name: "Bank Transfer", value: 20, color: "#1a4231" },
    { name: "Zamtel Kwacha", value: 7, color: "#0066CC" },
];

export const voucherRedemptionByMonth = [
    { month: "Nov", issued: 120000, redeemed: 45000 },
    { month: "Dec", issued: 180000, redeemed: 120000 },
    { month: "Jan", issued: 240000, redeemed: 200000 },
    { month: "Feb", issued: 180000, redeemed: 170000 },
    { month: "Mar", issued: 120000, redeemed: 108000 },
];

export const inventoryBreakdown = [
    { name: "Maize", value: 15400, color: "#FBBF24" },
    { name: "Soya", value: 8250, color: "#34D399" },
    { name: "Wheat", value: 4120, color: "#F97316" },
    { name: "Sunflower", value: 2100, color: "#A78BFA" },
    { name: "Cotton", value: 1800, color: "#60A5FA" },
];

// =========================================================
// SUMMARY STATS
// =========================================================
export const summaryStats = {
    totalFarmers: 1240500,
    verifiedHectares: 4200000,
    totalPaymentsZMW: 850000000,
    pendingFraudFlags: 142,
    activeTrucks: 42,
    pendingCollections: 18,
    vouchersIssued: 1240000,
    vouchersRedeemed: 843000,
};
