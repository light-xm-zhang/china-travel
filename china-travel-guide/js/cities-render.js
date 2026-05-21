/**
 * Ultimate China Travel Guide — Render Engine v3
 * Interactive China map + Search + Filters + Pagination + Tabbed city details
 */
(function () {
    'use strict';

    var FEATURED_IDS = [];
    var mapInstances = {};
    var chinaOverviewMap = null;
    var chinaGeoLayer = null;
    var activeProvinceLayer = null;

    // =========================================================================
    // Province Mapping (GeoJSON Chinese name → city data)
    // =========================================================================
    var provinceMapping = {
        '北京市': { cityId: 'beijing' },
        '天津市': { display: 'Tianjin', cityId: 'tianjin' },
        '河北省': { display: 'Hebei', cityId: 'chengde' },
        '山西省': { display: 'Shanxi', cityId: 'datong' },
        '内蒙古自治区': { display: 'Inner Mongolia', cityId: 'hohhot' },
        '辽宁省': { display: 'Liaoning', cityId: 'dalian' },
        '吉林省': { display: 'Jilin', cityId: 'yanbian' },
        '黑龙江省': { display: 'Heilongjiang', cityId: 'harbin' },
        '上海市': { cityId: 'shanghai' },
        '江苏省': { display: 'Jiangsu', cityId: 'suzhou' },
        '浙江省': { cityId: 'hangzhou' },
        '安徽省': { display: 'Anhui', cityId: 'huangshan' },
        '福建省': { cityId: 'xiamen' },
        '江西省': { display: 'Jiangxi', cityId: 'jingdezhen' },
        '山东省': { display: 'Shandong', cityId: 'qingdao' },
        '河南省': { display: 'Henan', cityId: 'luoyang' },
        '湖北省': { display: 'Hubei', cityId: 'wuhan' },
        '湖南省': { cityId: 'zhangjiajie' },
        '广东省': { display: 'Guangdong', cityId: 'guangzhou' },
        '广西壮族自治区': { cityId: 'guilin' },
        '海南省': { display: 'Hainan', cityId: 'sanya' },
        '重庆市': { cityId: 'chongqing' },
        '四川省': { cityId: 'chengdu' },
        '贵州省': { display: 'Guizhou', cityId: 'guiyang' },
        '云南省': { display: 'Yunnan', cityId: 'kunming' },
        '西藏自治区': { display: 'Tibet', cityId: 'lhasa' },
        '陕西省': { cityId: 'xian' },
        '甘肃省': { display: 'Gansu', cityId: 'dunhuang' },
        '青海省': { display: 'Qinghai', cityId: 'xining' },
        '宁夏回族自治区': { display: 'Ningxia', cityId: 'yinchuan' },
        '新疆维吾尔自治区': { display: 'Xinjiang', cityId: 'urumqi' },
        '台湾省': { display: 'Taiwan', cityId: 'taipei' },
        '香港特别行政区': { display: 'Hong Kong', cityId: 'hongkong' },
        '澳门特别行政区': { display: 'Macau', cityId: 'macau' }
    };

    function getProvinceDisplay(name) {
        var m = provinceMapping[name];
        if (!m) return name;
        if (m.cityId) {
            var city = window.CitySearch && window.CitySearch.getById(m.cityId);
            if (city) return city.name;
        }
        return m.display || name;
    }

    function getProvinceColor(name) {
        var m = provinceMapping[name];
        if (!m || !m.cityId) return '#e2e8f0';
        var city = window.CitySearch && window.CitySearch.getById(m.cityId);
        if (!city || !city.featured) return '#e8eaf0';
        var cmap = { red: '#fecaca', blue: '#bfdbfe', amber: '#fde68a', green: '#bbf7d0',
            teal: '#99f6e4', cyan: '#a5f3fc', emerald: '#a7f3d0', purple: '#e9d5ff',
            rose: '#fecdd3', sky: '#bae6fd', orange: '#fed7aa', slate: '#e2e8f0',
            yellow: '#fef08a', pink: '#fbcfe8' };
        return cmap[city.regionColor] || '#e2e8f0';
    }

    // =========================================================================
    // 1. China Overview Map (Leaflet + GeoJSON)
    // =========================================================================
    function initChinaMap() {
        var mapEl = document.getElementById('china-overview-map');
        if (!mapEl || typeof L === 'undefined') {
            if (mapEl) mapEl.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Map loading...</div>';
            return;
        }
        try {
            // Use same tile source as city maps (proven working)
            chinaOverviewMap = L.map(mapEl, {
                center: [35.8, 108.5], zoom: 4, minZoom: 3, maxZoom: 10,
                scrollWheelZoom: true, zoomControl: true, attributionControl: false
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 10,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            }).addTo(chinaOverviewMap);

            // PRIMARY: Add city markers (always works, no external data needed)
            addCityMarkers();

            // ENHANCEMENT: Try to load province GeoJSON overlay
            fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
                .then(function (r) { return r.json(); })
                .then(function (data) { renderGeoJSON(data); })
                .catch(function () { /* GeoJSON failed — city markers are sufficient */ });

            var loading = document.getElementById('map-loading');
            if (loading) loading.style.display = 'none';
            renderQuickChips();
        } catch (e) { console.warn('China map error:', e); }
    }

    // City marker layer (reliable, no external data dependency)
    function addCityMarkers() {
        if (!chinaOverviewMap) return;
        var cities = window.CitySearch ? window.CitySearch.getFeatured() : [];
        if (cities.length === 0) return;
        cities.forEach(function (c) {
            if (!c.map || !c.map.center) return;
            var marker = L.circleMarker(c.map.center, {
                radius: 7,
                fillColor: cityColor(c.regionColor),
                color: '#fff',
                weight: 2,
                fillOpacity: 0.9
            }).addTo(chinaOverviewMap);
            marker.bindTooltip(c.emoji + ' ' + c.name, {
                permanent: false, direction: 'top', className: 'province-tooltip', opacity: 0.9
            });
            marker.on('click', function () { jumpToCity(c.id); });
        });
    }

    function cityColor(rc) {
        var m = { red: '#dc2626', blue: '#2563eb', amber: '#d97706', green: '#16a34a',
                  teal: '#0d9488', cyan: '#0891b2', emerald: '#059669', purple: '#7c3aed',
                  rose: '#e11d48', sky: '#0284c7', orange: '#ea580c', slate: '#475569',
                  yellow: '#ca8a04', pink: '#db2777', indigo: '#4f46e5' };
        return m[rc] || '#dc2626';
    }

    function renderGeoJSON(data) {
        if (!chinaOverviewMap) return;
        chinaGeoLayer = L.geoJSON(data, {
            style: function (f) { return { fillColor: getProvinceColor(f.properties.name), weight: 1.2, color: '#fff', fillOpacity: 0.3 }; },
            onEachFeature: function (f, layer) {
                var name = f.properties.name;
                layer.on({
                    click: function () { handleProvinceClick(name, layer); },
                    mouseover: function (e) { e.target.setStyle({ fillOpacity: 0.6, weight: 2.5 }); },
                    mouseout: function (e) { if (activeProvinceLayer !== e.target) e.target.setStyle({ fillOpacity: 0.3, weight: 1.2 }); }
                });
                layer.bindTooltip(getProvinceDisplay(name), { sticky: true, direction: 'center', className: 'province-tooltip', opacity: 0.9 });
            }
        }).addTo(chinaOverviewMap);
    }

    function renderQuickChips() {
        var container = document.getElementById('map-quick-chips');
        if (!container) return;
        var featured = window.CitySearch ? window.CitySearch.getFeatured() : [];
        if (featured.length === 0) return;
        var chips = featured.slice(0, 10).map(function (c) {
            return '<button onclick="jumpToCity(\'' + c.id + '\')" class="px-3 py-1.5 bg-' + (c.regionColor || 'slate') + '-50 text-' + (c.regionColor || 'slate') + '-700 text-xs font-medium rounded-full hover:bg-' + (c.regionColor || 'slate') + '-100 transition-colors whitespace-nowrap flex-shrink-0">' + (c.emoji || '📍') + ' ' + c.name + '</button>';
        });
        container.innerHTML = chips.join('');
    }

    window.handleProvinceClick = function (name, layer) {
        var m = provinceMapping[name];
        if (!m) return;
        if (activeProvinceLayer) activeProvinceLayer.setStyle({ fillOpacity: 0.72, weight: 1.2, color: '#fff' });
        if (layer) { layer.setStyle({ fillOpacity: 0.95, weight: 3, color: '#dc2626' }); layer.bringToFront(); activeProvinceLayer = layer; }
        if (m.cityId) { jumpToCity(m.cityId); }
        else {
            var panel = document.getElementById('province-result');
            if (panel) {
                panel.innerHTML = '<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center"><p class="text-gray-600">📍 <strong>' + (m.display || name) + '</strong></p><p class="text-sm text-gray-500 mt-1">Use the filter below or scroll to explore this region\'s cities.</p></div>';
                panel.classList.remove('hidden');
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    window.jumpToCity = function (cityId) {
        if (chinaGeoLayer) {
            chinaGeoLayer.eachLayer(function (layer) {
                var n = layer.feature && layer.feature.properties && layer.feature.properties.name;
                var pm = n ? provinceMapping[n] : null;
                if (pm && pm.cityId === cityId) {
                    if (activeProvinceLayer) activeProvinceLayer.setStyle({ fillOpacity: 0.72, weight: 1.2, color: '#fff' });
                    layer.setStyle({ fillOpacity: 0.95, weight: 3, color: '#dc2626' }); layer.bringToFront();
                    activeProvinceLayer = layer;
                }
            });
        }
        // Scroll to city detail if featured, otherwise to filtered list
        var section = document.getElementById(cityId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            var list = document.getElementById('city-filtered-list');
            if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.resetChinaMap = function () {
        if (activeProvinceLayer) { activeProvinceLayer.setStyle({ fillOpacity: 0.72, weight: 1.2, color: '#fff' }); activeProvinceLayer = null; }
        var panel = document.getElementById('province-result');
        if (panel) panel.classList.add('hidden');
        if (chinaOverviewMap) chinaOverviewMap.setView([35.8, 108.5], 4, { animate: true });
    };

    // =========================================================================
    // 2. Search Modal
    // =========================================================================
    function initSearch() {
        var searchIcon = document.getElementById('search-toggle');
        var searchIconMobile = document.getElementById('search-toggle-mobile');
        var searchModal = document.getElementById('search-modal');
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        var searchClose = document.getElementById('search-close');
        if (!searchModal) return;

        function openSearch() {
            searchModal.classList.remove('hidden');
            setTimeout(function () { if (searchInput) searchInput.focus(); }, 100);
        }

        if (searchIcon) searchIcon.addEventListener('click', openSearch);
        if (searchIconMobile) searchIconMobile.addEventListener('click', openSearch);

        if (searchClose) {
            searchClose.addEventListener('click', function () { searchModal.classList.add('hidden'); });
        }

        searchModal.addEventListener('click', function (e) {
            if (e.target === searchModal) searchModal.classList.add('hidden');
        });

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                clearTimeout(window._searchTimer);
                window._searchTimer = setTimeout(function () {
                    var q = searchInput.value;
                    if (!q || q.length < 1) { searchResults.innerHTML = '<p class="text-gray-400 text-sm text-center py-6">Type a city, province, or attraction name...</p>'; return; }
                    var results = window.CitySearch ? window.CitySearch.search(q) : [];
                    if (results.length === 0) {
                        searchResults.innerHTML = '<p class="text-gray-400 text-sm text-center py-6">No cities found for "' + q + '"</p>';
                    } else {
                        searchResults.innerHTML = results.map(function (r) {
                            var c = r.city;
                            return '<button onclick="navigateFromSearch(\'' + c.id + '\')" class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3 transition-colors"><span class="text-xl">' + (c.emoji || '📍') + '</span><div><p class="font-semibold text-sm text-gray-900">' + c.name + ' <span class="text-xs text-gray-400 font-normal">' + (c.nameCN || '') + '</span></p><p class="text-xs text-gray-500">' + (c.province || '') + ' · ' + (c.badge || '') + '</p></div></button>';
                        }).join('');
                    }
                }, 250);
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') searchModal.classList.add('hidden');
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchModal.classList.remove('hidden'); setTimeout(function () { if (searchInput) searchInput.focus(); }, 100); }
        });
    }

    window.navigateFromSearch = function (cityId) {
        var modal = document.getElementById('search-modal');
        if (modal) modal.classList.add('hidden');
        var input = document.getElementById('search-input');
        if (input) input.value = '';
        jumpToCity(cityId);
    };

    // =========================================================================
    // 3. Filter Controls
    // =========================================================================
    function initFilters() {
        var container = document.getElementById('filter-controls');
        if (!container) return;

        container.innerHTML = `
        <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-gray-500 flex-shrink-0">Region:</span>
            <button onclick="applyRegionFilter(null)" data-region="" class="filter-chip filter-chip-active px-3 py-1.5 rounded-full text-xs font-medium transition-colors">All</button>
            <button onclick="applyRegionFilter('north')" data-region="north" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors">华北 North</button>
            <button onclick="applyRegionFilter('northeast')" data-region="northeast" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">东北 Northeast</button>
            <button onclick="applyRegionFilter('east')" data-region="east" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">华东 East</button>
            <button onclick="applyRegionFilter('central')" data-region="central" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">华中 Central</button>
            <button onclick="applyRegionFilter('south')" data-region="south" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700 transition-colors">华南 South</button>
            <button onclick="applyRegionFilter('southwest')" data-region="southwest" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors">西南 Southwest</button>
            <button onclick="applyRegionFilter('northwest')" data-region="northwest" class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">西北 Northwest</button>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="text-xs font-semibold text-gray-500 flex-shrink-0">Theme:</span>
            <button onclick="applyTagFilter(null)" data-tag="" class="tag-chip tag-chip-active px-3 py-1.5 rounded-full text-xs font-medium transition-colors">All</button>
            <button onclick="applyTagFilter('hot')" data-tag="hot" class="tag-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors">🔥 Popular</button>
            <button onclick="applyTagFilter('history')" data-tag="history" class="tag-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">🏛️ History & Culture</button>
            <button onclick="applyTagFilter('nature')" data-tag="nature" class="tag-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors">⛰️ Nature</button>
            <button onclick="applyTagFilter('food')" data-tag="food" class="tag-chip px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-colors">🍜 Food</button>
        </div>`;
    }

    window.applyRegionFilter = function (region) {
        window.CitySearch && window.CitySearch.filter({ region: region, tag: null });
        updateChipStyles('filter-chip', region);
        updateChipStyles('tag-chip', null);
        renderFilteredList();
    };

    window.applyTagFilter = function (tag) {
        window.CitySearch && window.CitySearch.filter({ tag: tag, region: null });
        updateChipStyles('tag-chip', tag);
        updateChipStyles('filter-chip', null);
        renderFilteredList();
    };

    function updateChipStyles(cls, activeVal) {
        document.querySelectorAll('.' + cls).forEach(function (btn) {
            var val = btn.getAttribute('data-region') || btn.getAttribute('data-tag') || '';
            if (val === (activeVal || '')) {
                btn.classList.add(cls + '-active');
                btn.classList.remove('bg-gray-100', 'text-gray-600');
                btn.classList.add('bg-red-50', 'text-red-700');
            } else {
                btn.classList.remove(cls + '-active');
                btn.classList.add('bg-gray-100', 'text-gray-600');
                btn.classList.remove('bg-red-50', 'text-red-700');
            }
        });
    }

    // =========================================================================
    // 4. Render Filtered City List (with pagination)
    // =========================================================================
    function renderFilteredList() {
        var container = document.getElementById('city-filtered-list');
        var paginationEl = document.getElementById('pagination-controls');
        if (!container) return;

        var paginated = window.CitySearch ? window.CitySearch.getAll() : { items: [], total: 0, page: 1, totalPages: 1, hasMore: false };
        var results = paginated.items;

        if (results.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-400 py-10">No cities match the current filters. <button onclick="resetAllFilters()" class="text-red-600 underline">Reset filters</button></p>';
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        container.innerHTML = results.map(function (c) {
            if (c.featured) {
                return '<div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow city-card cursor-pointer" onclick="jumpToCity(\'' + c.id + '\')"><div class="bg-gradient-to-r ' + (c.heroBg || 'from-gray-700 to-gray-800') + ' px-4 py-3 text-white"><div class="flex items-center justify-between"><h4 class="font-bold">' + (c.emoji || '') + ' ' + c.name + ' <span class="text-xs font-normal opacity-70">' + (c.nameCN || '') + '</span></h4><span class="text-[10px] bg-white/15 px-2 py-0.5 rounded-full">' + (c.badge || '') + '</span></div></div><div class="p-4"><p class="text-xs text-gray-500 line-clamp-2">' + (c.desc || '') + '</p><div class="flex flex-wrap gap-1 mt-2">' + (c.tags || []).map(function (t) { var names = { hot: 'Popular', history: 'History', nature: 'Nature', food: 'Food' }; return '<span class="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">' + (names[t] || t) + '</span>'; }).join('') + '</div></div></div>';
            } else {
                return '<div class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="jumpToCity(\'' + c.id + '\')"><h4 class="font-bold text-gray-900 text-sm">' + c.name + ' <span class="text-xs font-normal text-gray-400">' + (c.nameCN || '') + '</span></h4><p class="text-xs text-gray-500 mt-1">' + (c.desc || '') + ' <strong>Eat:</strong> ' + (c.food || '') + '.</p><span class="inline-block mt-2 text-[10px] font-medium text-' + (c.color || 'gray') + '-600 bg-' + (c.color || 'gray') + '-50 px-2 py-0.5 rounded">' + (c.days || '') + '</span></div>';
            }
        }).join('');

        // Pagination
        if (paginationEl) {
            if (paginated.totalPages > 1) {
                var pHtml = '<div class="flex items-center justify-center gap-2">';
                pHtml += '<span class="text-xs text-gray-500">' + paginated.total + ' cities · Page ' + paginated.page + ' of ' + paginated.totalPages + '</span>';
                if (paginated.page > 1) pHtml += '<button onclick="loadMore(-1)" class="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200">← Prev</button>';
                if (paginated.hasMore) pHtml += '<button onclick="loadMore(1)" class="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100">Next →</button>';
                pHtml += '</div>';
                paginationEl.innerHTML = pHtml;
            } else {
                paginationEl.innerHTML = '<p class="text-center text-xs text-gray-400">' + paginated.total + ' cities</p>';
            }
        }
    }

    window.loadMore = function (dir) {
        var page = (window.CitySearch ? window.CitySearch.getAll().page : 1) + dir;
        if (page < 1) page = 1;
        window.CitySearch && window.CitySearch.setPage(page);
        renderFilteredList();
        document.getElementById('city-filtered-list') && document.getElementById('city-filtered-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.resetAllFilters = function () {
        window.CitySearch && window.CitySearch.resetFilter();
        updateChipStyles('filter-chip', null);
        updateChipStyles('tag-chip', null);
        renderFilteredList();
    };

    // =========================================================================
    // 5. Render Featured City Detail Sections
    // =========================================================================
    function renderCityDetails() {
        var container = document.getElementById('city-details-container');
        if (!container) return;
        var featured = window.CitySearch ? window.CitySearch.getFeatured() : [];
        if (featured.length === 0) { container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading city details...</p>'; return; }

        FEATURED_IDS = featured.map(function (c) { return c.id; });

        var html = '';
        featured.forEach(function (c) {
            var rc = c.regionColor || 'slate';
            var atts = (c.attractions || []).map(function (a, i) {
                var colors = ['red', 'amber', 'blue', 'green', 'purple'];
                return '<div class="border-l-4 border-' + (a.color || colors[i]) + '-500 pl-4"><h4 class="font-semibold text-gray-900">' + a.name + '</h4><p class="text-sm text-gray-500 mt-1">' + a.desc + '</p></div>';
            }).join('');

            var foods = (c.food || []).map(function (f) {
                if (typeof f === 'string') return '';
                return '<div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><span class="text-xl flex-shrink-0">' + (f.emoji || '🍽️') + '</span><div><p class="font-semibold text-sm text-gray-900">' + f.name + '</p><p class="text-xs text-gray-500 mt-0.5">' + (f.desc || '') + '</p></div></div>';
            }).join('');

            var markerLabels = (c.map && c.map.markers || []).map(function (m) {
                return '<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-' + rc + '-50 text-' + rc + '-700 text-xs font-medium rounded-full">📍 ' + m.name + '</span>';
            }).join('');

            var transportTips = c.transport && c.transport.tips ? '<div class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100"><h4 class="font-bold text-amber-800 mb-2 text-sm">💡 Local Tips</h4><ul class="space-y-1">' + c.transport.tips.map(function (t) { return '<li class="text-xs text-amber-700 flex gap-2"><span>•</span> ' + t + '</li>'; }).join('') + '</ul></div>' : '';

            html += `
            <section id="${c.id}" class="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div class="bg-gradient-to-r ${c.heroBg || 'from-gray-700 to-gray-800'} p-6 md:p-10 text-white">
                        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <p class="opacity-70 text-sm mb-1">${c.province || ''}</p>
                                <h2 class="text-2xl sm:text-3xl font-bold">${c.emoji || ''} ${c.name} <span class="opacity-70 text-lg font-normal">${c.nameCN || ''}</span></h2>
                                <p class="opacity-80 mt-2 max-w-xl text-sm">${c.desc || ''}</p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">${c.best || ''}</span>
                                <span class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">${c.days || ''} days</span>
                            </div>
                        </div>
                    </div>
                    <div class="border-b border-gray-200 flex overflow-x-auto">
                        <button onclick="switchTab('${c.id}', 'attractions', this)" data-tab="${c.id}-attractions" class="tab-btn tab-btn-active flex-1 min-w-[80px] px-4 py-3.5 text-sm font-semibold text-red-600 border-b-2 border-red-500 bg-red-50/50 whitespace-nowrap">📍 Attractions</button>
                        <button onclick="switchTab('${c.id}', 'food', this)" data-tab="${c.id}-food" class="tab-btn flex-1 min-w-[80px] px-4 py-3.5 text-sm font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:bg-gray-50 whitespace-nowrap">🍜 Food</button>
                        <button onclick="switchTab('${c.id}', 'map', this)" data-tab="${c.id}-map" class="tab-btn flex-1 min-w-[80px] px-4 py-3.5 text-sm font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:bg-gray-50 whitespace-nowrap">🗺️ Map</button>
                        <button onclick="switchTab('${c.id}', 'transport', this)" data-tab="${c.id}-transport" class="tab-btn flex-1 min-w-[80px] px-4 py-3.5 text-sm font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:bg-gray-50 whitespace-nowrap">🚄 Transport</button>
                    </div>
                    <div class="p-6 md:p-10">
                        <div id="${c.id}-attractions" class="tab-panel"><div class="space-y-4">${atts}</div></div>
                        <div id="${c.id}-food" class="tab-panel hidden"><div class="grid sm:grid-cols-2 gap-4">${foods}</div></div>
                        <div id="${c.id}-map" class="tab-panel hidden">
                            <div class="bg-gray-100 rounded-xl overflow-hidden border border-gray-200" style="min-height:380px"><div id="${c.id}-leaflet-map" class="leaflet-map-container" style="width:100%;height:380px"></div></div>
                            <div class="flex flex-wrap gap-2 mt-3">${markerLabels}</div>
                        </div>
                        <div id="${c.id}-transport" class="tab-panel hidden">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="bg-blue-50 rounded-xl p-5 border border-blue-100"><h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">✈️ Getting There</h4><p class="text-sm text-gray-600 leading-relaxed">${(c.transport && c.transport.gettingThere) || ''}</p></div>
                                <div class="bg-green-50 rounded-xl p-5 border border-green-100"><h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">🚇 Local Transport</h4><p class="text-sm text-gray-600 leading-relaxed">${(c.transport && c.transport.local) || ''}</p></div>
                            </div>
                            ${transportTips}
                        </div>
                    </div>
                </div>
            </section>`;
        });
        container.innerHTML = html;
    }

    // =========================================================================
    // 6. Tab Switching + Lazy City Map (hardened for hidden→visible transition)
    // =========================================================================
    window.switchTab = function (cityId, tabName, btnEl) {
        if (!cityId || !tabName) return;
        var section = document.getElementById(cityId);
        if (!section) return;
        section.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.classList.remove('tab-btn-active');
            btn.classList.add('text-gray-500', 'border-transparent');
        });
        if (btnEl) { btnEl.classList.add('tab-btn-active'); btnEl.classList.remove('text-gray-500', 'border-transparent'); }

        // Toggle panels
        ['attractions', 'food', 'map', 'transport'].forEach(function (t) {
            var panel = document.getElementById(cityId + '-' + t);
            if (panel) {
                if (t === tabName) panel.classList.remove('hidden');
                else panel.classList.add('hidden');
            }
        });

        if (tabName === 'map') {
            // Wait for display:none→block to take effect in layout
            requestAnimationFrame(function () {
                initCityLeafletMap(cityId);
            });
        }
    };

    function initCityLeafletMap(cityId) {
        var mapEl = document.getElementById(cityId + '-leaflet-map');
        if (!mapEl) return;

        // ---- Already initialized: just force a full resize ----
        if (mapInstances[cityId]) {
            fixMapDimensions(mapEl);
            mapInstances[cityId].invalidateSize();
            return;
        }

        var c = window.CitySearch ? window.CitySearch.getById(cityId) : null;
        if (!c || !c.map) return;
        if (mapEl.dataset.initialized === 'true') return;
        if (typeof L === 'undefined') {
            mapEl.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">Map library not loaded</div>';
            return;
        }

        // ---- Force the container to have REAL pixel dimensions ----
        // This is the core fix: after display:none→block, percentage widths may
        // still resolve to 0. We compute the width from the visible ancestor.
        var sized = fixMapDimensions(mapEl);
        if (!sized) {
            // Parent not ready — retry after one more frame
            requestAnimationFrame(function () { initCityLeafletMap(cityId); });
            return;
        }

        try {
            var map = L.map(mapEl, {
                scrollWheelZoom: false,
                attributionControl: false
            }).setView(c.map.center, c.map.zoom);

            // Primary tile source: CartoDB Voyager (reliable, no API key)
            // Same provider works for the China overview map — proven reliable
            var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            }).addTo(map);

            // Fallback: if CARTO fails, try OSM directly
            tileLayer.on('tileerror', function (err) {
                if (!map._fallbackAdded) {
                    map._fallbackAdded = true;
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    }).addTo(map);
                }
            });

            L.control.attribution({ prefix: false }).addTo(map);

            if (c.map.markers) {
                c.map.markers.forEach(function (m) {
                    L.marker([m.lat, m.lng])
                        .addTo(map)
                        .bindPopup('<strong>' + m.name + '</strong>');
                });
            }

            mapEl.dataset.initialized = 'true';
            mapInstances[cityId] = map;

            // Final safety-net resize after tiles begin loading
            setTimeout(function () { map.invalidateSize(); }, 300);
        } catch (e) {
            console.warn('Leaflet map failed for ' + cityId + ':', e.message);
            mapEl.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">Map unavailable — ' + e.message + '</div>';
        }
    }

    /**
     * Force the map container to have explicit px dimensions.
     * Returns true if sizing succeeded, false if we need to retry.
     */
    function fixMapDimensions(mapEl) {
        // Walk up to find a visible ancestor with measurable width
        var ancestor = mapEl.parentElement;
        var w = 0;
        while (ancestor && w === 0) {
            w = ancestor.clientWidth || ancestor.offsetWidth || 0;
            ancestor = ancestor.parentElement;
        }

        if (w === 0) return false;

        // Subtract padding of the immediate parent (p-6 md:p-10 in the template)
        var parentStyle = window.getComputedStyle(mapEl.parentElement);
        var padLeft = parseInt(parentStyle.paddingLeft, 10) || 0;
        var padRight = parseInt(parentStyle.paddingRight, 10) || 0;
        w = w - padLeft - padRight;

        // Also account for the outer bg-gray-100 wrapper's padding + border
        if (mapEl.parentElement.classList.contains('bg-gray-100') || mapEl.parentElement.style.minHeight) {
            // The outer wrapper has no padding; inner content area has the padding
            // parent of mapEl is the tab-panel div, which has p-6 md:p-10
        }

        if (w < 200) return false; // Too narrow — retry

        // Set explicit px dimensions on the map element
        mapEl.style.width = w + 'px';
        mapEl.style.height = '380px';
        mapEl.style.position = 'relative';
        return true;
    }

    // =========================================================================
    // 7. Hash Navigation
    // =========================================================================
    function handleHashChange() {
        var hash = window.location.hash.replace('#', '');
        if (!hash) return;
        var parts = hash.split('-');
        var cityId = parts[0];
        var tabName = parts.length > 1 ? parts[1] : 'attractions';
        setTimeout(function () {
            var section = document.getElementById(cityId);
            if (!section) return;
            var btn = section.querySelector('[data-tab="' + cityId + '-' + tabName + '"]');
            if (btn) window.switchTab(cityId, tabName, btn);
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    window.addEventListener('hashchange', handleHashChange);

    // =========================================================================
    // 8. Init — synchronous (data already embedded, no fetch needed)
    // =========================================================================
    function init() {
        var statusEl = document.getElementById('debug-status');
        function status(msg, ok) {
            console.log('[cities] ' + msg);
            if (statusEl) { statusEl.textContent = msg; statusEl.className = 'text-xs py-1 px-3 rounded-full ' + (ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'); }
        }

        if (!window.CitySearch) { status('CitySearch missing', false); return; }

        // Load the embedded data synchronously (no fetch needed)
        CitySearch.load(function () {
            try {
                initChinaMap();
                initSearch();
                initFilters();
                renderCityDetails();
                renderFilteredList();
                setTimeout(handleHashChange, 300);
                status('Ready — ' + CitySearch.getFeatured().length + ' cities', true);
            } catch (e) {
                status('Error: ' + e.message, false);
            }
        });
    }

    // Run when DOM and all scripts are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
