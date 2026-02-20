CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE website_chunks (
  id BIGSERIAL PRIMARY KEY,

  url TEXT,
  title TEXT,

  content TEXT NOT NULL,

  embedding VECTOR(3072),

  created_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX website_chunks_embedding_idx
ON website_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);


ANALYZE website_chunks;
