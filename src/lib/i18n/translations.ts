// ============================================================================
// Internationalization — Translation Definitions
// ============================================================================

export type Locale = "en" | "tr";

export interface Translations {
    // Header
    header: {
        brand: string;
        subtitle: string;
        connected: string;
        noConnection: string;
        connectDb: string;
        change: string;
        poweredBy: string;
        savedConnections: string;
        noSavedConnections: string;
        logout: string;
        darkMode: string;
        lightMode: string;
    };
    // Command Input
    commandInput: {
        askYourData: string;
        generatingInsight: string;
        connectFirst: string;
        enterToSend: string;
        generate: string;
        thinking: string;
        placeholders: string[];
    };
    // Empty State
    emptyState: {
        readyTitle: string;
        connectTitle: string;
        readyDesc: string;
        connectDesc: string;
        barCharts: string;
        barChartsDesc: string;
        trendLines: string;
        trendLinesDesc: string;
        pieCharts: string;
        pieChartsDesc: string;
        suggestedQuestions: string;
        loadingSuggestions: string;
    };
    // Connection Modal
    connectionModal: {
        title: string;
        description: string;
        securityNotice: string;
        securityBold: string;
        connectionName: string;
        connectionNamePlaceholder: string;
        host: string;
        port: string;
        username: string;
        usernamePlaceholder: string;
        password: string;
        databaseName: string;
        databasePlaceholder: string;
        useSsl: string;
        testAndConnect: string;
        testing: string;
        connectedBadge: string;
        failedBadge: string;
        // MongoDB-specific
        mongoUri: string;
        mongoUriPlaceholder: string;
        mongoUriTab: string;
        mongoManualTab: string;
        mongoUriHint: string;
    };
    // Chart Card
    chartCard: {
        showQuery: string;
        hideQuery: string;
        rows: string;
        exportPng: string;
        exportCsv: string;
        exportJson: string;
        delete: string;
    };
    // Progress
    progress: {
        generating: string;
        validating: string;
        executing: string;
        charting: string;
    };
    // Suggestions
    suggestions: {
        title: string;
        loading: string;
    };
    // Dashboard
    dashboard: {
        saveDashboard: string;
        dashboardName: string;
        savedDashboards: string;
        noDashboards: string;
        newDashboard: string;
        deleteDashboard: string;
    };
    // Toasts
    toasts: {
        connectedTo: string;
        tablesFound: string;
        chartGenerated: string;
        rowsIn: string;
        connectionFailed: string;
        networkError: string;
        connectDbFirst: string;
        noResults: string;
        exported: string;
        chartDeleted: string;
        connectionSaved: string;
        connectionDeleted: string;
    };
    // Footer
    footer: {
        brand: string;
        poweredBy: string;
    };
    // AI Prompt Language Instructions
    ai: {
        respondIn: string;
    };
}

export const translations: Record<Locale, Translations> = {
    en: {
        header: {
            brand: "InsightNode",
            subtitle: "AI-Powered Dashboard Builder",
            connected: "Connected",
            noConnection: "No connection",
            connectDb: "Connect DB",
            change: "Change",
            poweredBy: "Gemini",
            savedConnections: "Saved Connections",
            noSavedConnections: "No saved connections",
            logout: "Logout",
            darkMode: "Dark Mode",
            lightMode: "Light Mode",
        },
        commandInput: {
            askYourData: "Ask your data",
            generatingInsight: "Generating insight...",
            connectFirst: "Connect a database first",
            enterToSend: "Press Enter to send, Shift+Enter for new line",
            generate: "Generate",
            thinking: "Thinking...",
            placeholders: [
                "Show me the top 10 customers by total spending as a bar chart",
                "What is the monthly revenue trend for the last 12 months?",
                "Show the distribution of orders by status as a pie chart",
                "Compare average order value across product categories",
                "Show daily active users for the past 30 days as an area chart",
            ],
        },
        emptyState: {
            readyTitle: "Ready to explore your data",
            connectTitle: "Connect your database to start",
            readyDesc:
                "Ask a question in natural language and watch AI turn it into a beautiful, interactive chart.",
            connectDesc:
                'Click "Connect DB" above to link your PostgreSQL, MySQL, or MongoDB database. We\'ll handle the rest.',
            barCharts: "Bar Charts",
            barChartsDesc: "Compare categories and rankings",
            trendLines: "Trend Lines",
            trendLinesDesc: "Track metrics over time",
            pieCharts: "Pie Charts",
            pieChartsDesc: "Visualize proportions and shares",
            suggestedQuestions: "Suggested Questions",
            loadingSuggestions: "AI is analyzing your schema...",
        },
        connectionModal: {
            title: "Connect Database",
            description: "Enter your database credentials to start querying with AI.",
            securityNotice:
                "Please use credentials with read-only access for security. The app will only execute SELECT queries and safe aggregation pipelines.",
            securityBold: "Read-only recommended.",
            connectionName: "Connection Name",
            connectionNamePlaceholder: "My Production DB",
            host: "Host",
            port: "Port",
            username: "Username",
            usernamePlaceholder: "readonly_user",
            password: "Password",
            databaseName: "Database Name",
            databasePlaceholder: "my_database",
            useSsl: "Use SSL / TLS",
            testAndConnect: "Test & Connect",
            testing: "Testing...",
            connectedBadge: "Connected",
            failedBadge: "Failed",
            mongoUri: "Connection String",
            mongoUriPlaceholder: "mongodb+srv://user:pass@cluster.mongodb.net/mydb",
            mongoUriTab: "Connection String",
            mongoManualTab: "Manual",
            mongoUriHint: "Paste your MongoDB URI (mongodb:// or mongodb+srv://)",
        },
        chartCard: {
            showQuery: "Show Query",
            hideQuery: "Hide Query",
            rows: "rows",
            exportPng: "Export PNG",
            exportCsv: "Export CSV",
            exportJson: "Export JSON",
            delete: "Delete",
        },
        progress: {
            generating: "Generating query...",
            validating: "Validating...",
            executing: "Querying database...",
            charting: "Creating chart...",
        },
        suggestions: {
            title: "Suggested Questions",
            loading: "Generating suggestions...",
        },
        dashboard: {
            saveDashboard: "Save Dashboard",
            dashboardName: "Dashboard Name",
            savedDashboards: "Saved Dashboards",
            noDashboards: "No saved dashboards",
            newDashboard: "New Dashboard",
            deleteDashboard: "Delete Dashboard",
        },
        toasts: {
            connectedTo: "Connected to",
            tablesFound: "tables/collections found.",
            chartGenerated: "Chart generated!",
            rowsIn: "rows in",
            connectionFailed: "Connection failed.",
            networkError: "Network error. Please try again.",
            connectDbFirst: "Please connect a database first.",
            noResults: "The query returned no results. Try a different question.",
            exported: "Exported successfully!",
            chartDeleted: "Chart removed.",
            connectionSaved: "Connection saved.",
            connectionDeleted: "Connection deleted.",
        },
        footer: {
            brand: "InsightNode — AI-Powered Dashboard Builder",
            poweredBy: "Powered by Google Gemini",
        },
        ai: {
            respondIn: "Respond and generate all explanations in English.",
        },
    },
    tr: {
        header: {
            brand: "InsightNode",
            subtitle: "Yapay Zeka Destekli Dashboard",
            connected: "Bağlı",
            noConnection: "Bağlantı yok",
            connectDb: "Veritabanı Bağla",
            change: "Değiştir",
            poweredBy: "Gemini",
            savedConnections: "Kayıtlı Bağlantılar",
            noSavedConnections: "Kayıtlı bağlantı yok",
            logout: "Çıkış",
            darkMode: "Koyu Tema",
            lightMode: "Açık Tema",
        },
        commandInput: {
            askYourData: "Verinize sorun",
            generatingInsight: "İçgörü oluşturuluyor...",
            connectFirst: "Önce bir veritabanı bağlayın",
            enterToSend: "Göndermek için Enter, yeni satır için Shift+Enter",
            generate: "Oluştur",
            thinking: "Düşünüyor...",
            placeholders: [
                "Son aydaki en çok harcama yapan ilk 10 müşteriyi bar grafik olarak göster",
                "Son 12 ayın aylık gelir trendi nedir?",
                "Siparişlerin durumlarına göre dağılımını pasta grafik olarak göster",
                "Ürün kategorileri arasında ortalama sipariş değerini karşılaştır",
                "Son 30 günün günlük aktif kullanıcılarını alan grafiği olarak göster",
            ],
        },
        emptyState: {
            readyTitle: "Verilerinizi keşfetmeye hazır",
            connectTitle: "Başlamak için veritabanınızı bağlayın",
            readyDesc:
                "Doğal dilde bir soru sorun ve yapay zekanın bunu güzel, etkileşimli bir grafiğe dönüştürmesini izleyin.",
            connectDesc:
                'PostgreSQL, MySQL veya MongoDB veritabanınızı bağlamak için yukarıdaki "Veritabanı Bağla" butonuna tıklayın.',
            barCharts: "Bar Grafikler",
            barChartsDesc: "Kategorileri ve sıralamaları karşılaştırın",
            trendLines: "Trend Çizgileri",
            trendLinesDesc: "Zaman içindeki metrikleri takip edin",
            pieCharts: "Pasta Grafikler",
            pieChartsDesc: "Oranları ve payları görselleştirin",
            suggestedQuestions: "Önerilen Sorular",
            loadingSuggestions: "AI şemanızı analiz ediyor...",
        },
        connectionModal: {
            title: "Veritabanı Bağla",
            description:
                "Yapay zeka ile sorgulamaya başlamak için veritabanı bilgilerinizi girin.",
            securityNotice:
                "Güvenlik için lütfen salt okunur erişime sahip kimlik bilgileri kullanın. Uygulama yalnızca SELECT sorguları ve güvenli aggregation pipeline'ları çalıştıracaktır.",
            securityBold: "Salt okunur erişim önerilir.",
            connectionName: "Bağlantı Adı",
            connectionNamePlaceholder: "Üretim Veritabanım",
            host: "Sunucu",
            port: "Port",
            username: "Kullanıcı Adı",
            usernamePlaceholder: "readonly_user",
            password: "Şifre",
            databaseName: "Veritabanı Adı",
            databasePlaceholder: "veritabanim",
            useSsl: "SSL / TLS Kullan",
            testAndConnect: "Test Et ve Bağlan",
            testing: "Test ediliyor...",
            connectedBadge: "Bağlandı",
            failedBadge: "Başarısız",
            mongoUri: "Bağlantı Dizesi",
            mongoUriPlaceholder: "mongodb+srv://kullanici:sifre@cluster.mongodb.net/veritabanim",
            mongoUriTab: "Bağlantı Dizesi",
            mongoManualTab: "Manuel",
            mongoUriHint: "MongoDB URI'nizi yapıştırın (mongodb:// veya mongodb+srv://)",
        },
        chartCard: {
            showQuery: "Sorguyu Göster",
            hideQuery: "Sorguyu Gizle",
            rows: "satır",
            exportPng: "PNG İndir",
            exportCsv: "CSV İndir",
            exportJson: "JSON İndir",
            delete: "Sil",
        },
        progress: {
            generating: "Sorgu oluşturuluyor...",
            validating: "Doğrulanıyor...",
            executing: "Veritabanı sorgulanıyor...",
            charting: "Grafik hazırlanıyor...",
        },
        suggestions: {
            title: "Önerilen Sorular",
            loading: "Öneriler oluşturuluyor...",
        },
        dashboard: {
            saveDashboard: "Dashboard Kaydet",
            dashboardName: "Dashboard Adı",
            savedDashboards: "Kayıtlı Dashboard'lar",
            noDashboards: "Kayıtlı dashboard yok",
            newDashboard: "Yeni Dashboard",
            deleteDashboard: "Dashboard Sil",
        },
        toasts: {
            connectedTo: "Bağlanıldı:",
            tablesFound: "tablo/koleksiyon bulundu.",
            chartGenerated: "Grafik oluşturuldu!",
            rowsIn: "satır,",
            connectionFailed: "Bağlantı başarısız.",
            networkError: "Ağ hatası. Lütfen tekrar deneyin.",
            connectDbFirst: "Lütfen önce bir veritabanı bağlayın.",
            noResults: "Sorgu sonuç döndürmedi. Farklı bir soru deneyin.",
            exported: "Başarıyla dışa aktarıldı!",
            chartDeleted: "Grafik kaldırıldı.",
            connectionSaved: "Bağlantı kaydedildi.",
            connectionDeleted: "Bağlantı silindi.",
        },
        footer: {
            brand: "InsightNode — Yapay Zeka Destekli Dashboard",
            poweredBy: "Google Gemini ile güçlendirildi",
        },
        ai: {
            respondIn: "Tüm yanıtları ve açıklamaları Türkçe olarak oluştur.",
        },
    },
};
