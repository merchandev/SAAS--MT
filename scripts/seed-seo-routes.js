"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var routesToSeed = [
    {
        slug: "airport-transfer-barcelona",
        originName: "Aeropuerto de Barcelona",
        destinationName: "Barcelona",
        h1Title: "Barcelona Airport Transfer",
        seoKeywords: "barcelona airport transfer, aeropuerto barcelona a centro, transfer bcn",
        isActive: true,
    },
    {
        slug: "cruise-port-transfer-barcelona",
        originName: "Puerto de Cruceros de Barcelona",
        destinationName: "Barcelona",
        h1Title: "Barcelona Cruise Port Transfer",
        seoKeywords: "barcelona cruise port transfer, puerto barcelona a aeropuerto, transfer puerto",
        isActive: true,
    },
    {
        slug: "chauffeur-service-barcelona",
        originName: "Barcelona",
        destinationName: "Barcelona (Por horas)",
        h1Title: "Chauffeur Service Barcelona",
        seoKeywords: "chauffeur service barcelona, conductor privado barcelona, coche por horas",
        isActive: true,
    },
    {
        slug: "corporate-transfers-barcelona",
        originName: "Barcelona",
        destinationName: "Eventos Corporativos",
        h1Title: "Corporate Transfers Barcelona",
        seoKeywords: "corporate transfers barcelona, traslados congresos, traslados empresas",
        isActive: true,
    },
    {
        slug: "barcelona-to-andorra-transfer",
        originName: "Barcelona",
        destinationName: "Andorra",
        h1Title: "Barcelona to Andorra Transfer",
        seoKeywords: "barcelona to andorra transfer, traslado barcelona andorra, coche andorra",
        isActive: true,
    },
    {
        slug: "barcelona-to-sitges-transfer",
        originName: "Barcelona",
        destinationName: "Sitges",
        h1Title: "Barcelona to Sitges Transfer",
        seoKeywords: "barcelona to sitges transfer, traslado barcelona sitges, taxi sitges",
        isActive: true,
    },
    {
        slug: "barcelona-to-costa-brava-transfer",
        originName: "Barcelona",
        destinationName: "Costa Brava",
        h1Title: "Barcelona to Costa Brava Transfer",
        seoKeywords: "barcelona to costa brava transfer, traslado costa brava, taxi girona costa brava",
        isActive: true,
    },
    {
        slug: "montserrat-private-tour",
        originName: "Barcelona",
        destinationName: "Montserrat",
        h1Title: "Montserrat Private Tour",
        seoKeywords: "montserrat private tour, excursión montserrat privada, tour montserrat",
        isActive: true,
    }
];
function seedRoutes() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, routesToSeed_1, route, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding SEO routes...");
                    _i = 0, routesToSeed_1 = routesToSeed;
                    _a.label = 1;
                case 1:
                    if (!(_i < routesToSeed_1.length)) return [3 /*break*/, 6];
                    route = routesToSeed_1[_i];
                    return [4 /*yield*/, prisma.routePage.findUnique({
                            where: { slug: route.slug }
                        })];
                case 2:
                    existing = _a.sent();
                    if (!!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.routePage.create({
                            data: route
                        })];
                case 3:
                    _a.sent();
                    console.log("Created route: ".concat(route.slug));
                    return [3 /*break*/, 5];
                case 4:
                    console.log("Route already exists: ".concat(route.slug));
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("Done seeding SEO routes!");
                    return [2 /*return*/];
            }
        });
    });
}
seedRoutes()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
