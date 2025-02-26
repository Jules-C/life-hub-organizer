flowchart TB
    subgraph Cloud ["Cloud Services"]
        direction TB
        subgraph Storage ["Document Storage"]
            S3[S3-Compatible Storage]
            DB[(Database)]
        end
        
        subgraph Compute ["Application Services"]
            WebApp[Web Application]
            API[API Service]
            Queue[Job Queue]
            Workers[Background Workers]
        end
        
        subgraph Integration ["Integration Layer"]
            Webhooks[Webhook Receivers]
            EmailProc[Email Processor]
            CalSync[Calendar Sync]
        end
    end
    
    subgraph External ["External Services"]
        Gmail[Gmail]
        GCal[Google Calendar]
        Outlook[Outlook Calendar]
        YNAB[YNAB - Future]
    end
    
    subgraph Users ["User Devices"]
        Browser[Web Browser]
        Mobile[Mobile Devices]
        Scanner[Document Scanner]
    end
    
    %% Connections
    Browser --> WebApp
    Mobile --> WebApp
    Scanner --> WebApp
    
    WebApp --> API
    API --> DB
    API --> S3
    
    API --> Queue
    Queue --> Workers
    Workers --> S3
    Workers --> DB
    
    Webhooks --> API
    EmailProc --> API
    CalSync --> API
    
    Gmail --> EmailProc
    GCal --> CalSync
    Outlook --> CalSync
    YNAB -.-> API
    
    style Cloud fill:#f5f5f5,stroke:#333,stroke-width:1px
    style Storage fill:#e1f5fe,stroke:#333,stroke-width:1px
    style Compute fill:#e8f5e9,stroke:#333,stroke-width:1px
    style Integration fill:#fff8e1,stroke:#333,stroke-width:1px
    style External fill:#f3e5f5,stroke:#333,stroke-width:1px
    style Users fill:#fce4ec,stroke:#333,stroke-width:1px