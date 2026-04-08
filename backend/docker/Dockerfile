FROM node:22-alpine
WORKDIR /app
COPY ./backend ./backend
WORKDIR /app/backend
RUN npm install
# Defaults Might change however
ENV DATABASE_URL mongodb://admin:example@localhost:27017
ENV JWT_SECRET 40377dd1299cf86ca9af8682b3d192d7513a501b3cded17f14172d39eae3a67e
ENV PORT 3000
ENV NODE_ENV development
ENV DOMAIN none 
ENV EMAIL_SENDER none 
ENV IAM_USER_NAME none 
ENV SES_SMTP_HOST none 
ENV SES_SMTP_PASSWORD none 
ENV SES_SMPT_USER none 
RUN echo -e "${JWT_SECRET}\n${PORT}\n${NODE_ENV}" > .env
CMD ["npm", "start"]
