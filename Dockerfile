FROM bkeepers/probot-action:latest

WORKDIR /app
COPY . .
RUN npm install --production

# Absolute path to app entrypoint
CMD ["/app/lib/index.js"]
