flowchart TD
    subgraph "User Interfaces"
        WebApp[Web Application]
        MobileWeb[Mobile Web Interface]
        NotificationSystem[Notification System]
    end

    subgraph "Core Services"
        AuthService[Authentication & Authorization]
        DocumentService[Document Management]
        DocumentTypeService[Document Type Management]
        CalendarService[Calendar Management]
        HealthTrackingService[Health Data Management]
        PersonalEventService[Personal Schedule Management]
        EmailService[Email Processing]
        TaskService[Task Management]
        UserService[User & Family Management]
    end

    subgraph "Specialized Modules"
        MedicalModule[Medical Document Subsystem]
        SchoolModule[School & Activity Management]
        ElderCareModule[Elder Care Coordination]
        FinancialModule[Financial Management]
        CommunicationHub[Family Communication Hub]
    end

    subgraph "Integration Layer"
        APIGateway[API Gateway]
        WebhookService[Webhook Service]
        IntegrationEngine[Integration Engine]
    end

    subgraph "External Services"
        GoogleCalendar[Google Calendar]
        OutlookCalendar[Outlook Calendar]
        GmailAPI[Gmail]
        YNAB[YNAB - Future]
        WeatherAPI[Weather Services]
    end

    subgraph "Infrastructure"
        SupabaseDB[(Supabase Database)]
        SupabaseStorage[(Document Storage)]
        SupabaseAuth[Authentication]
    end

    subgraph "Intelligence Services"
        OCRService[OCR Processing]
        PriorityEngine[Priority Scoring]
        MLCategorization[Document Categorization]
        ContextEngine[Context Awareness]
    end

    %% Main connections
    WebApp <--> APIGateway
    MobileWeb <--> APIGateway
    NotificationSystem <--> APIGateway

    APIGateway <--> AuthService
    APIGateway <--> DocumentService
    APIGateway <--> DocumentTypeService
    DocumentService <--> DocumentTypeService
    APIGateway <--> CalendarService
    APIGateway <--> HealthTrackingService
    APIGateway <--> PersonalEventService
    CalendarService <--> PersonalEventService
    UserService <--> HealthTrackingService
    APIGateway <--> EmailService
    APIGateway <--> TaskService
    APIGateway <--> UserService

    DocumentService <--> MedicalModule
    DocumentService <--> SchoolModule
    DocumentService <--> FinancialModule
    CalendarService <--> SchoolModule
    CalendarService <--> ElderCareModule
    TaskService <--> ElderCareModule
    UserService <--> CommunicationHub

    IntegrationEngine <--> GoogleCalendar
    IntegrationEngine <--> OutlookCalendar
    IntegrationEngine <--> GmailAPI
    IntegrationEngine <--> YNAB
    IntegrationEngine <--> WeatherAPI

    WebhookService --> IntegrationEngine
    IntegrationEngine --> APIGateway

    AuthService <--> SupabaseAuth
    DocumentService <--> SupabaseStorage
    DocumentService <--> OCRService
    EmailService <--> PriorityEngine
    DocumentService <--> MLCategorization
    CalendarService <--> ContextEngine
    
    %% Database connections
    SupabaseDB <--> DocumentService
    SupabaseDB <--> CalendarService
    SupabaseDB <--> EmailService
    SupabaseDB <--> TaskService
    SupabaseDB <--> UserService
    SupabaseDB <--> MedicalModule
    SupabaseDB <--> HealthTrackingService
    SupabaseDB <--> PersonalEventService
    SupabaseDB <--> SchoolModule
    SupabaseDB <--> ElderCareModule
    SupabaseDB <--> FinancialModule
    SupabaseDB <--> CommunicationHub

    %% Health connections
    HealthTrackingService <--> MedicalModule
    HealthTrackingService <--> CalendarService
    
    %% Specialized connections
    MedicalModule <--> ElderCareModule
    SchoolModule <--> TaskService
    FinancialModule <--> DocumentService
    CommunicationHub <--> NotificationSystem
    
    %% Intelligence connections
    OCRService --> MLCategorization
    PriorityEngine --> NotificationSystem
    ContextEngine --> NotificationSystem
    ContextEngine --> WebApp
    ContextEngine --> MobileWeb
    
    classDef core fill:#e1f5fe,stroke:#333,stroke-width:1px
    classDef specialized fill:#e8f5e9,stroke:#333,stroke-width:1px
    classDef integration fill:#fff8e1,stroke:#333,stroke-width:1px
    classDef external fill:#f3e5f5,stroke:#333,stroke-width:1px
    classDef infra fill:#ffebee,stroke:#333,stroke-width:1px
    classDef intelligence fill:#f5f5f5,stroke:#333,stroke-width:1px
    classDef ui fill:#e0f2f1,stroke:#333,stroke-width:1px
    
    class AuthService,DocumentService,DocumentTypeService,CalendarService,HealthTrackingService,PersonalEventService,EmailService,TaskService,UserService core
    class MedicalModule,SchoolModule,ElderCareModule,FinancialModule,CommunicationHub specialized
    class APIGateway,WebhookService,IntegrationEngine integration
    class GoogleCalendar,OutlookCalendar,GmailAPI,YNAB,WeatherAPI external
    class SupabaseDB,SupabaseStorage,SupabaseAuth infra
    class OCRService,PriorityEngine,MLCategorization,ContextEngine intelligence
    class WebApp,MobileWeb,NotificationSystem ui