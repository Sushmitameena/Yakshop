const express = require('express');
const fs = require('fs');
const app = express();

// Constants
const YAK_YEAR_DAYS = 100;
const MAX_YAK_AGE_DAYS = 10 * YAK_YEAR_DAYS; // 1000 days, yak dies at 10 years

// Helper function to calculate milk and shaving
function calculateHerdStock(herd, T) {
    let milkProduced = 0;
    let skinsCollected = 0;

    herd.forEach((yak) => {
        const ageInDays = yak.age * YAK_YEAR_DAYS + T;

        if (ageInDays < MAX_YAK_AGE_DAYS && yak.sex === 'f') {
            // Calculate milk produced by the yak
            for (let day = 0; day < T; day++) {
                const dailyMilk = 50 - (yak.age * YAK_YEAR_DAYS + day) * 0.03;
                if (dailyMilk > 0) milkProduced += dailyMilk;
            }

            // Calculate skins produced (yak can be shaved every 8 + D * 0.01 days)
            let lastShaved = yak.age * YAK_YEAR_DAYS;
            while (lastShaved <= ageInDays) {
                skinsCollected++;
                lastShaved += 8 + lastShaved * 0.01;
            }
        }
    });

    return {
        milk: parseFloat(milkProduced.toFixed(2)),
        skins: skinsCollected,
    };
}


// Helper function to calculate herd details after T days
function getHerdState(herd, T) {
    return herd.map((yak) => {
        const initialAgeInDays = yak.age * YAK_YEAR_DAYS; // Convert years to days
        const currentAgeInDays = initialAgeInDays + T; // Age in days after T days

        // Calculate the last time it was shaved
        let shaveIntervalDays = 8 + initialAgeInDays * 0.01; // Shaving interval in days
        let lastShavedAgeInDays = initialAgeInDays;

        while (lastShavedAgeInDays + shaveIntervalDays <= currentAgeInDays) {
            lastShavedAgeInDays += shaveIntervalDays;
            shaveIntervalDays = 8 + lastShavedAgeInDays * 0.01;
        }

        // Convert days back to years
        const ageInYears = currentAgeInDays / YAK_YEAR_DAYS;
        const lastShavedInYears = lastShavedAgeInDays / YAK_YEAR_DAYS;

        return {
            name: yak.name,
            age: parseFloat(ageInYears.toFixed(2)),
            ageLastShaved: parseFloat(lastShavedInYears.toFixed(2)),
        };
    });
}

// Load herd data from JSON file
let herdData;
fs.readFile('input.json', (err, data) => {
    if (err) {
        console.error("Error reading herd data:", err);
        return;
    }
    herdData = JSON.parse(data).herd;
});

// Get stock after T days
app.get('/yak-shop/stock/:T', (req, res) => {
    const T = parseInt(req.params.T);
    if (!herdData) {
        return res.status(500).json({ error: 'Herd data not loaded' });
    }

    const stock = calculateHerdStock(herdData, T);
    res.json(stock);
});

// Get herd state after T days
app.get('/yak-shop/herd/:T', (req, res) => {
    const T = parseInt(req.params.T);
    if (!herdData) {
        return res.status(500).json({ error: 'Herd data not loaded' });
    }

    const herdState = getHerdState(herdData, T);
    res.json({ herd: herdState });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`YakShop server running on port ${PORT}`);
});
