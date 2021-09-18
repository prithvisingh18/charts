import fs from "fs";

let data = fs.readFileSync("./static/data/cityCoords.json");
data = JSON.parse(data);

let cleanedData = data.map((el) => {
    return {
        city: el.city.toLowerCase(),
        lat: el.lat,
        long: el.lng,
    };
});

fs.writeFileSync("./static/data/cityCoords-cleaned.json", JSON.stringify(cleanedData));
