###############################################
# Backend Image
###############################################
# Use an explicit Rust toolchain installation so that the build is not affected by stale
# base images that might ship with an older compiler. We install Rust 1.82.0, which is the
# minimum version required by transitive dependencies such as `icu_normalizer` and `time`.
FROM rust:bookworm AS builder
RUN rustup toolchain install 1.82.0 \
    && rustup default 1.82.0
WORKDIR /app
COPY src ./src
COPY Cargo.toml .
COPY Cargo.lock .
COPY collection_log_info.json .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update
RUN apt-get install -y openssl ca-certificates
RUN rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/server ./
COPY --from=builder /app/collection_log_info.json ./
COPY ./docker-entrypoint.sh ./

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["/app/server"]


