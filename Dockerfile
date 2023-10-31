FROM mcr.microsoft.com/playwright:v1.39.0-jammy

COPY . .
RUN npm ci
ENV CI=true

ENTRYPOINT [ "npm" ]
CMD ["test"]
