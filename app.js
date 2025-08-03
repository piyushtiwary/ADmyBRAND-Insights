// Dashboard Application JavaScript
class DashboardApp {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.sortField = '';
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.statusFilter = '';
        this.charts = {};
        this.activePage = 'dashboard';
        
        this.init();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // localStorage not available, continue without storing
        }
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.initTheme();
        this.loadData();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
            this.animateMetrics();
            this.initCharts();
            this.setupRealTimeUpdates();
        }, 2000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Add fade-in animation to main content
        document.querySelectorAll('.metric-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const overlay = document.getElementById('overlay');

        sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
        mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());
        overlay?.addEventListener('click', () => this.closeMobileMenu());

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Table functionality
        this.setupTableEventListeners();

        // Search functionality
        const tableSearch = document.getElementById('table-search');
        const statusFilter = document.getElementById('status-filter');
        
        tableSearch?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        statusFilter?.addEventListener('change', (e) => {
            this.statusFilter = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });

        // Metric card hover effects
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMetricHover(card, true));
            card.addEventListener('mouseleave', () => this.handleMetricHover(card, false));
        });
    }

    setupTableEventListeners() {
        // Sorting
        document.querySelectorAll('[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                this.handleSort(field);
            });
        });

        // Pagination
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');

        prevPage?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        });

        nextPage?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.getFilteredData().length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
            }
        });
    }

    loadData() {
        // Sample data from the provided JSON
        this.data = {
            keyMetrics: {
                revenue: { value: 124590, growth: 12.5 },
                users: { value: 25847, growth: 8.3 },
                conversions: { value: 1247, growth: -2.1 },
                growthRate: { value: 15.7, growth: 3.2 }
            },
            lineChartData: [
                { date: "2025-07-04", revenue: 3547, users: 1082, conversions: 45 },
                { date: "2025-07-05", revenue: 3810, users: 1195, conversions: 52 },
                { date: "2025-07-06", revenue: 4229, users: 922, conversions: 38 },
                { date: "2025-07-07", revenue: 4446, users: 1058, conversions: 61 },
                { date: "2025-07-08", revenue: 4564, users: 1044, conversions: 47 },
                { date: "2025-07-09", revenue: 3892, users: 1167, conversions: 55 },
                { date: "2025-07-10", revenue: 4123, users: 989, conversions: 42 },
                { date: "2025-07-11", revenue: 4678, users: 1234, conversions: 58 },
                { date: "2025-07-12", revenue: 4321, users: 1089, conversions: 49 },
                { date: "2025-07-13", revenue: 4556, users: 1156, conversions: 53 },
                { date: "2025-07-14", revenue: 4789, users: 1201, conversions: 61 },
                { date: "2025-07-15", revenue: 4234, users: 1034, conversions: 46 },
                { date: "2025-07-16", revenue: 4567, users: 1178, conversions: 54 },
                { date: "2025-07-17", revenue: 4891, users: 1267, conversions: 59 },
                { date: "2025-07-18", revenue: 4345, users: 1045, conversions: 48 },
                { date: "2025-07-19", revenue: 4678, users: 1189, conversions: 56 },
                { date: "2025-07-20", revenue: 4912, users: 1278, conversions: 62 },
                { date: "2025-07-21", revenue: 4456, users: 1098, conversions: 51 },
                { date: "2025-07-22", revenue: 4789, users: 1234, conversions: 57 },
                { date: "2025-07-23", revenue: 5023, users: 1345, conversions: 64 },
                { date: "2025-07-24", revenue: 4567, users: 1123, conversions: 49 },
                { date: "2025-07-25", revenue: 4890, users: 1267, conversions: 58 },
                { date: "2025-07-26", revenue: 5134, users: 1389, conversions: 66 },
                { date: "2025-07-27", revenue: 4678, users: 1156, conversions: 52 },
                { date: "2025-07-28", revenue: 4969, users: 1298, conversions: 61 },
                { date: "2025-07-29", revenue: 5245, users: 1423, conversions: 68 },
                { date: "2025-07-30", revenue: 4789, users: 1178, conversions: 54 },
                { date: "2025-07-31", revenue: 5089, users: 1334, conversions: 63 },
                { date: "2025-08-01", revenue: 5356, users: 1456, conversions: 71 },
                { date: "2025-08-02", revenue: 4923, users: 1234, conversions: 58 }
            ],
            trafficSources: [
                { source: "Organic Search", value: 8542, percentage: 42.1 },
                { source: "Social Media", value: 5234, percentage: 25.8 },
                { source: "Direct", value: 3456, percentage: 17.0 },
                { source: "Email", value: 2134, percentage: 10.5 },
                { source: "Referral", value: 934, percentage: 4.6 }
            ],
            deviceBreakdown: [
                { device: "Desktop", value: 12847, percentage: 52.3 },
                { device: "Mobile", value: 9234, percentage: 37.6 },
                { device: "Tablet", value: 2477, percentage: 10.1 }
            ],
            campaigns: [
                { id: "CAMP-1000", name: "Summer Sale 2024", status: "Active", budget: 38230, spent: 28450, impressions: 540000, clicks: 12400, conversions: 245, ctr: 2.3, cpc: 2.29 },
                { id: "CAMP-1001", name: "Brand Awareness Q4", status: "Paused", budget: 25000, spent: 18230, impressions: 320000, clicks: 8900, conversions: 156, ctr: 2.8, cpc: 2.05 },
                { id: "CAMP-1002", name: "Product Launch Campaign", status: "Active", budget: 45000, spent: 32100, impressions: 680000, clicks: 15600, conversions: 312, ctr: 2.3, cpc: 2.06 },
                { id: "CAMP-1003", name: "Holiday Special", status: "Draft", budget: 30000, spent: 0, impressions: 0, clicks: 0, conversions: 0, ctr: 0, cpc: 0 },
                { id: "CAMP-1004", name: "Back to School", status: "Completed", budget: 22000, spent: 21890, impressions: 450000, clicks: 11200, conversions: 198, ctr: 2.5, cpc: 1.95 },
                { id: "CAMP-1005", name: "New Year Promotion", status: "Active", budget: 35000, spent: 26700, impressions: 520000, clicks: 13800, conversions: 267, ctr: 2.7, cpc: 1.93 }
            ],
            realTime: {
                activeUsers: 247,
                pageViews: 1089,
                bounceRate: 42.3
            }
        };

        this.renderTable();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    initTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.setStoredTheme(this.currentTheme);
        this.updateThemeIcon();
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);

        // Update charts for theme change
        setTimeout(() => {
            this.updateChartsForTheme();
        }, 100);
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    updateChartsForTheme() {
        // Update chart colors based on theme
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update();
            }
        });
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const page = e.currentTarget.getAttribute('data-page');
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        e.currentTarget.classList.add('active');
        
        // Hide all page content
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page content
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.activePage = page;
            
            // Update page title
            this.updatePageTitle(page);
            
            // If switching to campaigns page, render table
            if (page === 'campaigns') {
                this.renderTable();
            }
        }
        
        // Close mobile menu if open
        this.closeMobileMenu();
    }

    updatePageTitle(page) {
        const pageTitle = document.querySelector('.page-title');
        const titles = {
            dashboard: 'Dashboard Overview',
            campaigns: 'Campaign Management',
            analytics: 'Advanced Analytics',
            audience: 'Audience Insights',
            reports: 'Reports & Exports',
            settings: 'Settings & Configuration'
        };
        
        if (pageTitle && titles[page]) {
            pageTitle.textContent = titles[page];
        }
    }

    animateMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        const rtValues = document.querySelectorAll('.rt-value');
        
        [...metricValues, ...rtValues].forEach(element => {
            const finalValue = element.getAttribute('data-value');
            if (finalValue && !isNaN(finalValue)) {
                this.animateCounter(element, 0, parseFloat(finalValue), 2000);
            }
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const isPercentage = element.textContent.includes('%');
        const isCurrency = element.textContent.includes('$');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;
            
            if (isCurrency) {
                element.textContent = '$' + Math.floor(current).toLocaleString();
            } else if (isPercentage) {
                element.textContent = current.toFixed(1) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    handleMetricHover(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(-4px) scale(1)';
        }
    }

    initCharts() {
        this.initRevenueChart();
        this.initTrafficChart();
        this.initDeviceChart();
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.lineChartData.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Revenue',
                    data: this.data.lineChartData.map(item => item.revenue),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#1FB8CD',
                    pointHoverBackgroundColor: '#1FB8CD',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Revenue: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initTrafficChart() {
        const ctx = document.getElementById('trafficChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.traffic = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.trafficSources.map(item => item.source),
                datasets: [{
                    label: 'Visitors',
                    data: this.data.trafficSources.map(item => item.value),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderRadius: 4,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initDeviceChart() {
        const ctx = document.getElementById('deviceChart')?.getContext('2d');
        if (!ctx) return;
        
        this.charts.device = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.deviceBreakdown.map(item => item.device),
                datasets: [{
                    data: this.data.deviceBreakdown.map(item => item.value),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.parsed / context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    getFilteredData() {
        let filtered = [...this.data.campaigns];
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(campaign =>
                campaign.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                campaign.id.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (this.statusFilter) {
            filtered = filtered.filter(campaign => campaign.status === this.statusFilter);
        }
        
        // Apply sorting
        if (this.sortField) {
            filtered.sort((a, b) => {
                let aVal = a[this.sortField];
                let bVal = b[this.sortField];
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }
        
        return filtered;
    }

    handleSort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        
        this.renderTable();
        this.updateSortIcons();
    }

    updateSortIcons() {
        document.querySelectorAll('[data-sort] i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });
        
        if (this.sortField) {
            const activeHeader = document.querySelector(`[data-sort="${this.sortField}"] i`);
            if (activeHeader) {
                activeHeader.className = this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            }
        }
    }

    renderTable() {
        const filteredData = this.getFilteredData();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        const tbody = document.getElementById('table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        pageData.forEach(campaign => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${campaign.name}</td>
                <td><span class="status ${campaign.status.toLowerCase()}">${campaign.status}</span></td>
                <td>$${campaign.budget.toLocaleString()}</td>
                <td>$${campaign.spent.toLocaleString()}</td>
                <td>${campaign.impressions.toLocaleString()}</td>
                <td>${campaign.clicks.toLocaleString()}</td>
                <td>${campaign.ctr}%</td>
                <td>$${campaign.cpc}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" title="Pause"><i class="fas fa-pause"></i></button>
                        <button class="action-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        this.updatePagination(filteredData.length);
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
        
        // Update pagination info
        const showingStart = document.getElementById('showing-start');
        const showingEnd = document.getElementById('showing-end');
        const totalRecords = document.getElementById('total-records');
        
        if (showingStart) showingStart.textContent = startItem;
        if (showingEnd) showingEnd.textContent = endItem;
        if (totalRecords) totalRecords.textContent = totalItems;
        
        // Update pagination controls
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Update page numbers
        const pageNumbers = document.getElementById('page-numbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    this.currentPage = i;
                    this.renderTable();
                });
                pageNumbers.appendChild(pageBtn);
            }
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 30000);
    }

    updateRealTimeMetrics() {
        const activeUsers = document.querySelector('[data-value="247"]');
        const pageViews = document.querySelector('[data-value="1089"]');
        
        // Generate random variations
        const newActiveUsers = 247 + Math.floor(Math.random() * 20) - 10;
        const newPageViews = 1089 + Math.floor(Math.random() * 50) - 25;
        
        if (activeUsers) {
            activeUsers.setAttribute('data-value', newActiveUsers);
            this.animateCounter(activeUsers, parseInt(activeUsers.textContent), newActiveUsers, 1000);
        }
        
        if (pageViews) {
            pageViews.setAttribute('data-value', newPageViews);
            this.animateCounter(pageViews, parseInt(pageViews.textContent), newPageViews, 1000);
        }
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardApp();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.dashboard && window.dashboard.charts) {
        Object.values(window.dashboard.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
});