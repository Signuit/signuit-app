FROM eclipse-temurin:25-jdk-jammy

# Required packages
RUN apt-get update && apt-get install -y curl wget tar locales netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Turkish I problem fix — force en_US locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Install Daml SDK 3.4.11
RUN curl -sSL https://get.daml.com/ | sh -s 3.4.11

ENV PATH="/root/.daml/bin:${PATH}"

# Create data directory for H2 persistent storage
RUN mkdir -p /data

WORKDIR /workspace

# Expose ledger API and JSON HTTP API
EXPOSE 6865 7575

# Production: use canton.conf with H2 persistent storage
# The DAR file is auto-uploaded by the web app on startup (ensureDarUploaded)
CMD ["daml", "sandbox", "--config", "/workspace/canton.conf"]
