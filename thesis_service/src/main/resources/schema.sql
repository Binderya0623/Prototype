CREATE TABLE theses (
                        id VARCHAR(255) PRIMARY KEY,
                        student_id VARCHAR(255),
                        supervisor_id VARCHAR(255),
                        committee_id VARCHAR(255),
                        title_mn VARCHAR(255),
                        title_en VARCHAR(255),
                        description VARCHAR(255),
                        status VARCHAR(255),
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP
);