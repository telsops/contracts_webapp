export enum Estate {
    LIMA = "LIMA",
    BIZHUB = "BIZHUB",
    TARI = "TARI",
    MEZ2 = "MEZ2",
    WEST_CEBU = "WEST_CEBU",
}

export const estateNames: Record<Estate, string> = {
    [Estate.LIMA]: "Lima Estate",
    [Estate.BIZHUB]: "BizHub",
    [Estate.TARI]: "TARI Estate",
    [Estate.MEZ2]: "MEZ2",
    [Estate.WEST_CEBU]: "WEST CEBU Estate",
};

export enum ContractType {
    LOI = "LOI",
    RA = "RA",
    CTS = "CTS",
    DOAS = "DOAS",
    LTLA = "LTLA",
    OTHER = "Other",
}

export interface User {
    ssid: string;
    email: string;
}

export interface Admin {
    email: string;
}

export interface Contract {
    id: string; // Unique ID for the contract
    type: ContractType;
    fileName: string;
    driveUrl: string;
}

export interface Locator {
    id: string; // Unique ID for the locator, can be the "Locator" name itself if unique
    estate: Estate;
    locatorName: string;
    address: string;
    lotArea: number;
    industryType: string;
    contracts: Contract[];
}

export enum View {
  Home = 'Home',
  UserDashboard = 'UserDashboard',
  AdminDashboard = 'AdminDashboard',
}