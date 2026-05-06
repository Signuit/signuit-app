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

# Copy Daml source and config
COPY . .

# Build DAR and regenerate JS codegen at image build time.
# This ensures the compiled DAR is always in sync with the Daml source,
# and the output daml.js/ is embedded in the image for reference.
RUN daml build && \
    daml codegen js .daml/dist/nexus-example-0.0.1.dar -o daml.js 2>&1 | \
    grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable\|Skipping\|Generating"

# Expose ledger API and JSON HTTP API
EXPOSE 6865 7575

# Production: start Canton sandbox, then upload the DAR once the ledger is ready.
# Using a wrapper script so we can upload the DAR on first start.
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
CMD ["/docker-entrypoint.sh"]
