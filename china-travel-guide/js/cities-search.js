/**
 * Ultimate China Travel Guide — Search + Filter Engine
 * Loads cities.json, builds search index, handles filtering & pagination
 */
(function () {
    'use strict';

    // =========================================================================
    // State
    // =========================================================================
    var allCities = [];
    var featuredCities = [];
    var regionalCities = [];
    var searchIndex = {};
    var currentFilter = { region: null, tag: null, search: '' };
    var ITEMS_PER_PAGE = 20;
    var currentPage = 1;
    var searchDebounceTimer = null;

    // =========================================================================
    // 1. Load Data
    // =========================================================================
    function loadCityData(callback) {
        // Fast path: data embedded via <script> tag — no network request needed
        if (window.__EMBEDDED_CITIES__) {
            var data = window.__EMBEDDED_CITIES__;
            featuredCities = data.filter(function(c) { return c.featured; });
            regionalCities = data.filter(function(c) { return !c.featured; });
            allCities = data;
            buildSearchIndex();
            console.log('City data from embed: ' + allCities.length + ' cities');
            if (callback) setTimeout(callback, 0);
            return;
        }

        // Fallback: fetch from JSON file
        fetch('data/cities.json')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                featuredCities = data.cities || [];
                regionalCities = data._regional || [];
                allCities = featuredCities.concat(regionalCities);
                buildSearchIndex();
                console.log('City data loaded via fetch: ' + allCities.length + ' cities');
                if (callback) callback();
            })
            .catch(function (err) {
                console.warn('Failed to load cities.json:', err.message);
                if (window.CITY_DATA) {
                    loadFromLegacyData();
                    if (callback) callback();
                }
            });
    }

    function loadFromLegacyData() {
        // Convert old CITY_DATA format to the new format
        var data = window.CITY_DATA;
        featuredCities = [];
        var FEATURED_IDS = ['beijing','shanghai','xian','chengdu','guilin','xiamen','hangzhou','zhangjiajie'];
        FEATURED_IDS.forEach(function (id) {
            if (data[id]) {
                var c = data[id];
                featuredCities.push({
                    id: c.id, name: c.name, nameCN: c.nameCN, province: c.name, region: c.regionColor || 'slate',
                    badge: c.badge, tags: ['hot'], emoji: c.emoji, featured: true,
                    best: c.best, days: c.days, regionColor: c.regionColor,
                    heroBg: c.heroBg, desc: c.desc,
                    attractions: c.attractions, food: c.food, map: c.map, transport: c.transport
                });
            }
        });
        regionalCities = [];
        if (data.regionalGrids) {
            data.regionalGrids.forEach(function (grid) {
                grid.cities.forEach(function (city) {
                    regionalCities.push({
                        id: city.name.toLowerCase().replace(/\s+/g, '-'),
                        name: city.name, nameCN: city.cn, province: city.name,
                        region: mapRegion(grid.title), badge: '', tags: [], emoji: grid.emoji,
                        best: '', days: city.days, color: city.color,
                        desc: city.desc, food: city.food
                    });
                });
            });
        }
        allCities = featuredCities.concat(regionalCities);
        buildSearchIndex();
    }

    function mapRegion(title) {
        if (title.includes('North')) return 'north';
        if (title.includes('Northeast')) return 'northeast';
        if (title.includes('East') || title.includes('Southeast')) return 'east';
        if (title.includes('Central') || title.includes('Yellow')) return 'central';
        if (title.includes('South')) return 'south';
        if (title.includes('Southwest')) return 'southwest';
        if (title.includes('Northwest') || title.includes('Silk')) return 'northwest';
        return 'east';
    }

    // =========================================================================
    // 2. Search Index
    // =========================================================================
    function buildSearchIndex() {
        searchIndex = {};
        allCities.forEach(function (city) {
            var text = [
                city.name, city.nameCN, city.province, city.badge,
                (city.tags || []).join(' '),
                city.desc || '',
                city.food || ''
            ];
            if (city.attractions) {
                city.attractions.forEach(function (a) {
                    text.push(a.name);
                    if (a.desc) text.push(a.desc);
                });
            }
            if (city.food && Array.isArray(city.food)) {
              // already handled above for objects
            }
            searchIndex[city.id] = text.join(' ').toLowerCase();
        });
    }

    // =========================================================================
    // 3. Search
    // =========================================================================
    function doSearch(query) {
        if (!query || query.trim().length < 1) return [];
        var q = query.toLowerCase().trim();
        var results = [];
        allCities.forEach(function (city) {
            var text = searchIndex[city.id] || '';
            if (text.indexOf(q) >= 0) {
                var score = 0;
                var nameLow = city.name.toLowerCase();
                var provLow = city.province.toLowerCase();
                if (nameLow === q) score = 100;
                else if (nameLow.indexOf(q) === 0) score = 80;
                else if (nameLow.indexOf(q) > 0) score = 60;
                else if (provLow === q) score = 50;
                else if (provLow.indexOf(q) >= 0) score = 40;
                else if ((city.badge || '').toLowerCase().indexOf(q) >= 0) score = 30;
                else score = 20;
                results.push({ city: city, score: score });
            }
        });
        results.sort(function (a, b) { return b.score - a.score; });
        return results.slice(0, 10);
    }

    // =========================================================================
    // 4. Filter
    // =========================================================================
    function applyFilters() {
        var results = allCities.slice();
        if (currentFilter.region) {
            results = results.filter(function (c) { return c.region === currentFilter.region; });
        }
        if (currentFilter.tag) {
            results = results.filter(function (c) { return (c.tags || []).indexOf(currentFilter.tag) >= 0; });
        }
        if (currentFilter.search) {
            var q = currentFilter.search.toLowerCase().trim();
            results = results.filter(function (c) {
                return (searchIndex[c.id] || '').indexOf(q) >= 0;
            });
        }
        return results;
    }

    function getPaginatedResults(results) {
        var start = (currentPage - 1) * ITEMS_PER_PAGE;
        return {
            items: results.slice(start, start + ITEMS_PER_PAGE),
            total: results.length,
            page: currentPage,
            totalPages: Math.ceil(results.length / ITEMS_PER_PAGE),
            hasMore: (currentPage * ITEMS_PER_PAGE) < results.length
        };
    }

    // =========================================================================
    // 5. Public API
    // =========================================================================
    window.CitySearch = {
        load: loadCityData,
        search: doSearch,
        filter: function (opts) {
            if (opts.region !== undefined) currentFilter.region = opts.region;
            if (opts.tag !== undefined) currentFilter.tag = opts.tag;
            if (opts.search !== undefined) currentFilter.search = opts.search;
            currentPage = 1;
            var results = applyFilters();
            return getPaginatedResults(results);
        },
        setPage: function (page) {
            currentPage = page;
            var results = applyFilters();
            return getPaginatedResults(results);
        },
        getAll: function () {
            return getPaginatedResults(applyFilters());
        },
        getFeatured: function () { return featuredCities; },
        getRegional: function () { return regionalCities; },
        getById: function (id) {
            return allCities.find(function (c) { return c.id === id; });
        },
        getFilter: function () { return currentFilter; },
        resetFilter: function () {
            currentFilter = { region: null, tag: null, search: '' };
            currentPage = 1;
        },
        ITEMS_PER_PAGE: ITEMS_PER_PAGE
    };

})();
