/*
 * data.js — sample data for the Supply Chain dashboard.
 *
 * Replace the contents of SCM_DATA with real data (or load it from an API
 * and assign it to window.SCM_DATA before app.js runs). Field names below
 * are what app.js reads; keep them the same and everything else adapts.
 *
 * Tender status must be one of: "Initiated" | "In Progress" | "Completed".
 * Dates use ISO format: "YYYY-MM-DD".
 */
window.SCM_DATA = {
  company: { name: "Northwind Supply Co.", short: "NW" },

  people: [
    { id: "p1", name: "Aisha Rahman",   role: "Procurement Lead",   color: "#2563eb" },
    { id: "p2", name: "Daniel Okafor",  role: "Tender Specialist",  color: "#7c3aed" },
    { id: "p3", name: "Mei Lin",        role: "Supplier Manager",   color: "#0891b2" },
    { id: "p4", name: "Lucas Moreau",   role: "Logistics Planner",  color: "#db2777" },
    { id: "p5", name: "Priya Nair",     role: "Contract Analyst",   color: "#ea580c" },
    { id: "p6", name: "Tom Becker",     role: "Inventory Control",  color: "#059669" }
  ],

  tenders: [
    { id: "TND-2026-001", name: "Office Furniture Supply",          category: "Facilities",  status: "Completed",   progress: 100, created: "2026-01-08", deadline: "2026-03-15", completed: "2026-03-10", pic: "p1", budget: 85000,  supplier: "Apex Interiors",       description: "Framework agreement for desks, chairs and storage across 3 offices." },
    { id: "TND-2026-002", name: "Fleet Maintenance Contract",       category: "Logistics",   status: "Completed",   progress: 100, created: "2026-01-20", deadline: "2026-04-01", completed: "2026-03-28", pic: "p4", budget: 240000, supplier: "RoadStar Services",    description: "Preventive maintenance and repairs for 42 delivery vehicles." },
    { id: "TND-2026-003", name: "IT Hardware Refresh",              category: "IT",          status: "Completed",   progress: 100, created: "2026-02-03", deadline: "2026-05-10", completed: "2026-05-02", pic: "p2", budget: 410000, supplier: "Bytewise Distribution", description: "Replacement of 600 laptops and peripherals." },
    { id: "TND-2026-004", name: "Packaging Materials",              category: "Production",  status: "Completed",   progress: 100, created: "2026-02-17", deadline: "2026-04-20", completed: "2026-04-22", pic: "p3", budget: 120000, supplier: "GreenPack Ltd",        description: "Recyclable cartons, fillers and tape for distribution centres." },
    { id: "TND-2026-005", name: "Warehouse Racking System",         category: "Facilities",  status: "Completed",   progress: 100, created: "2026-03-05", deadline: "2026-06-30", completed: "2026-06-18", pic: "p6", budget: 330000, supplier: "SteelSpan Systems",    description: "Pallet racking installation for the new Eastgate warehouse." },
    { id: "TND-2026-006", name: "Cleaning Services",                category: "Facilities",  status: "Completed",   progress: 100, created: "2026-03-22", deadline: "2026-06-01", completed: "2026-05-29", pic: "p5", budget: 64000,  supplier: "BrightCare",           description: "Two-year cleaning contract for HQ and two depots." },
    { id: "TND-2026-007", name: "Raw Steel Supply Q3–Q4",           category: "Production",  status: "Completed",   progress: 100, created: "2026-04-10", deadline: "2026-07-15", completed: "2026-07-12", pic: "p3", budget: 780000, supplier: "Meridian Metals",      description: "Supply of cold-rolled steel coils for H2 production." },
    { id: "TND-2026-008", name: "Cold Chain Transport",             category: "Logistics",   status: "Completed",   progress: 100, created: "2026-05-02", deadline: "2026-08-20", completed: "2026-08-25", pic: "p4", budget: 295000, supplier: "FrostLine Freight",    description: "Temperature-controlled transport for perishable goods." },
    { id: "TND-2026-009", name: "ERP Support & Licensing",          category: "IT",          status: "In Progress", progress: 72,  created: "2026-05-19", deadline: "2026-10-31", completed: null,         pic: "p2", budget: 190000, supplier: "—",                    description: "Renewal of ERP licences plus 24/7 support SLA." },
    { id: "TND-2026-010", name: "Safety Equipment (PPE)",           category: "HSE",         status: "Completed",   progress: 100, created: "2026-06-04", deadline: "2026-08-30", completed: "2026-08-27", pic: "p6", budget: 52000,  supplier: "SafeGuard Supplies",   description: "Helmets, gloves, high-vis and safety footwear." },
    { id: "TND-2026-011", name: "Freight Forwarding – Asia Lanes",  category: "Logistics",   status: "In Progress", progress: 55,  created: "2026-06-21", deadline: "2026-11-30", completed: null,         pic: "p4", budget: 520000, supplier: "—",                    description: "Ocean & air forwarding for Shanghai, Busan and Ho Chi Minh lanes." },
    { id: "TND-2026-012", name: "Electrical Components",            category: "Production",  status: "In Progress", progress: 38,  created: "2026-07-08", deadline: "2026-10-25", completed: null,         pic: "p3", budget: 260000, supplier: "—",                    description: "Cables, connectors and control boards for assembly line B." },
    { id: "TND-2026-013", name: "Canteen Catering",                 category: "Facilities",  status: "Completed",   progress: 100, created: "2026-07-25", deadline: "2026-09-30", completed: "2026-09-26", pic: "p5", budget: 98000,  supplier: "FreshPlate Catering",  description: "Daily catering for 350 staff at HQ." },
    { id: "TND-2026-014", name: "Forklift Leasing",                 category: "Logistics",   status: "In Progress", progress: 81,  created: "2026-08-06", deadline: "2026-11-20", completed: null,         pic: "p6", budget: 175000, supplier: "—",                    description: "36-month lease of 20 electric forklifts." },
    { id: "TND-2026-015", name: "Cybersecurity Audit",              category: "IT",          status: "In Progress", progress: 24,  created: "2026-08-28", deadline: "2026-12-15", completed: null,         pic: "p2", budget: 70000,  supplier: "—",                    description: "External penetration test and ISO 27001 gap assessment." },
    { id: "TND-2026-016", name: "Plastic Resin Supply 2027",        category: "Production",  status: "Initiated",   progress: 10,  created: "2026-09-09", deadline: "2027-01-31", completed: null,         pic: "p3", budget: 640000, supplier: "—",                    description: "Annual supply of PP and HDPE resin." },
    { id: "TND-2026-017", name: "Solar Panels – Eastgate Roof",     category: "Facilities",  status: "Initiated",   progress: 5,   created: "2026-09-23", deadline: "2026-10-30", completed: null,         pic: "p1", budget: 450000, supplier: "—",                    description: "Design & install 800 kWp rooftop solar array." },
    { id: "TND-2026-018", name: "Customs Brokerage",                category: "Logistics",   status: "Initiated",   progress: 15,  created: "2026-10-02", deadline: "2027-01-15", completed: null,         pic: "p5", budget: 88000,  supplier: "—",                    description: "Customs clearance services for import shipments." },
    { id: "TND-2026-019", name: "Workwear & Uniforms",              category: "HSE",         status: "Initiated",   progress: 0,   created: "2026-10-14", deadline: "2027-02-28", completed: null,         pic: "p6", budget: 46000,  supplier: "—",                    description: "Branded uniforms for warehouse and driver staff." },
    { id: "TND-2026-020", name: "Data Centre Colocation",           category: "IT",          status: "Initiated",   progress: 8,   created: "2026-10-27", deadline: "2027-03-31", completed: null,         pic: "p2", budget: 310000, supplier: "—",                    description: "Colocation space for disaster-recovery servers." }
  ],

  // Default tasks. Once the user changes tasks, they are saved in localStorage.
  tasks: [
    { id: "t1",  title: "Review technical bids",            tenderId: "TND-2026-011", picId: "p4", due: "2026-11-07", priority: "High",   done: false },
    { id: "t2",  title: "Send clarification to bidders",    tenderId: "TND-2026-012", picId: "p3", due: "2026-11-05", priority: "High",   done: false },
    { id: "t3",  title: "Draft evaluation criteria",        tenderId: "TND-2026-016", picId: "p3", due: "2026-11-12", priority: "Medium", done: false },
    { id: "t4",  title: "Approve budget with Finance",      tenderId: "TND-2026-017", picId: "p1", due: "2026-11-06", priority: "High",   done: false },
    { id: "t5",  title: "Negotiate SLA terms",              tenderId: "TND-2026-009", picId: "p2", due: "2026-11-10", priority: "Medium", done: false },
    { id: "t6",  title: "Site visit with lessors",          tenderId: "TND-2026-014", picId: "p6", due: "2026-11-09", priority: "Low",    done: true  },
    { id: "t7",  title: "Prepare RFP document",             tenderId: "TND-2026-018", picId: "p5", due: "2026-11-14", priority: "Medium", done: false },
    { id: "t8",  title: "Shortlist audit vendors",          tenderId: "TND-2026-015", picId: "p2", due: "2026-11-18", priority: "Low",    done: false },
    { id: "t9",  title: "Collect size requirements",        tenderId: "TND-2026-019", picId: "p6", due: "2026-11-20", priority: "Low",    done: false },
    { id: "t10", title: "Legal review of draft contract",   tenderId: "TND-2026-011", picId: "p5", due: "2026-11-08", priority: "High",   done: false }
  ],

  suppliers: [
    { id: "SUP-01", name: "Meridian Metals",       category: "Raw Materials", country: "Germany",     rating: 4.7, onTime: 96, activeContracts: 3, status: "Preferred" },
    { id: "SUP-02", name: "GreenPack Ltd",         category: "Packaging",     country: "UK",          rating: 4.3, onTime: 91, activeContracts: 2, status: "Approved"  },
    { id: "SUP-03", name: "Bytewise Distribution", category: "IT",            country: "Netherlands", rating: 4.5, onTime: 94, activeContracts: 4, status: "Preferred" },
    { id: "SUP-04", name: "FrostLine Freight",     category: "Logistics",     country: "Denmark",     rating: 3.9, onTime: 87, activeContracts: 1, status: "Approved"  },
    { id: "SUP-05", name: "SteelSpan Systems",     category: "Facilities",    country: "Poland",      rating: 4.1, onTime: 89, activeContracts: 1, status: "Approved"  },
    { id: "SUP-06", name: "SafeGuard Supplies",    category: "HSE",           country: "France",      rating: 4.6, onTime: 98, activeContracts: 2, status: "Preferred" },
    { id: "SUP-07", name: "RoadStar Services",     category: "Logistics",     country: "Belgium",     rating: 3.4, onTime: 78, activeContracts: 1, status: "On Watch"  },
    { id: "SUP-08", name: "Apex Interiors",        category: "Facilities",    country: "Italy",       rating: 4.0, onTime: 90, activeContracts: 1, status: "Approved"  }
  ],

  inventory: [
    { sku: "STL-CR-150", name: "Cold-rolled steel coil 1.5mm", warehouse: "Eastgate",  qty: 420,  reorder: 300,  unit: "t"     },
    { sku: "PKG-CTN-L",  name: "Carton – large",               warehouse: "Northpark", qty: 1800, reorder: 2500, unit: "pcs"   },
    { sku: "PKG-TAPE",   name: "Packing tape 48mm",            warehouse: "Northpark", qty: 950,  reorder: 600,  unit: "rolls" },
    { sku: "ELC-CBL-25", name: "Control cable 2.5mm²",         warehouse: "Eastgate",  qty: 120,  reorder: 400,  unit: "m×100" },
    { sku: "RSN-PP-H",   name: "PP resin (homopolymer)",        warehouse: "Southside", qty: 64,   reorder: 50,   unit: "t"     },
    { sku: "PPE-GLV-M",  name: "Safety gloves – M",            warehouse: "Southside", qty: 340,  reorder: 500,  unit: "pairs" },
    { sku: "PPE-HLM",    name: "Safety helmet",                warehouse: "Eastgate",  qty: 210,  reorder: 120,  unit: "pcs"   },
    { sku: "PLT-EUR",    name: "Euro pallet",                  warehouse: "Northpark", qty: 760,  reorder: 800,  unit: "pcs"   }
  ],

  purchaseOrders: [
    { id: "PO-48210", supplier: "Meridian Metals",       tenderId: "TND-2026-007", date: "2026-10-02", amount: 186000, status: "Delivered" },
    { id: "PO-48231", supplier: "GreenPack Ltd",         tenderId: "TND-2026-004", date: "2026-10-09", amount: 22400,  status: "Shipped"   },
    { id: "PO-48245", supplier: "SafeGuard Supplies",    tenderId: "TND-2026-010", date: "2026-10-15", amount: 8900,   status: "Approved"  },
    { id: "PO-48252", supplier: "Bytewise Distribution", tenderId: "TND-2026-003", date: "2026-10-21", amount: 64300,  status: "Shipped"   },
    { id: "PO-48260", supplier: "FrostLine Freight",     tenderId: "TND-2026-008", date: "2026-10-27", amount: 31750,  status: "Pending"   },
    { id: "PO-48266", supplier: "Meridian Metals",       tenderId: "TND-2026-007", date: "2026-11-01", amount: 192500, status: "Pending"   },
    { id: "PO-48271", supplier: "FreshPlate Catering",   tenderId: "TND-2026-013", date: "2026-11-03", amount: 8150,   status: "Approved"  }
  ],

  shipments: [
    { id: "SHP-9031", origin: "Hamburg, DE",     destination: "Eastgate WH",  carrier: "FrostLine Freight", mode: "Road",  eta: "2026-11-06", status: "In Transit" },
    { id: "SHP-9034", origin: "Shanghai, CN",    destination: "Northpark WH", carrier: "OceanLink",         mode: "Sea",   eta: "2026-11-22", status: "In Transit" },
    { id: "SHP-9036", origin: "Rotterdam, NL",   destination: "Southside WH", carrier: "RoadStar Services", mode: "Road",  eta: "2026-11-04", status: "Delayed"    },
    { id: "SHP-9040", origin: "Busan, KR",       destination: "Eastgate WH",  carrier: "SkyCargo",          mode: "Air",   eta: "2026-11-05", status: "Customs"    },
    { id: "SHP-9042", origin: "Lyon, FR",        destination: "HQ",           carrier: "FrostLine Freight", mode: "Road",  eta: "2026-11-02", status: "Delivered"  },
    { id: "SHP-9045", origin: "Gdańsk, PL",      destination: "Eastgate WH",  carrier: "BalticRail",        mode: "Rail",  eta: "2026-11-11", status: "In Transit" }
  ]
};
