import fs from "fs";

let data = fs.readFileSync("./output_with_jobs.json");
data = JSON.parse(data);

let cleanedData = data.map((el) => {
    return {
        course: el.course?.trim(),
        uni: el.uni?.trim(),
        city: el.city?.trim(),
        fees_required:
            el.fees?.trim() === "none"
                ? "no"
                : el.fees?.trim() === "Please enquire"
                ? "maybe"
                : "yes",
        linkedin_jobs: parseInt(el.linkedin_jobs),
    };
});

fs.writeFileSync("output_with_jobs_cleaned.json", JSON.stringify(cleanedData));
