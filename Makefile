.PHONY: up down fresh sail artisan npm test

# Spin up the Laravel Sail environment
up:
	@./vendor/bin/sail up -d

# Stop the containers
down:
	@./vendor/bin/sail down

# Run artisan commands
artisan:
	@./vendor/bin/sail artisan $(ARGS)

# Run NPM dev script
npm:
	@./vendor/bin/sail npm run dev

# Full setup from scratch: install everything, migrate and seed, and run frontend dev
fresh: down
	@echo "Starting fresh setup..."
	@cp .env.example .env || true
	@./vendor/bin/sail up -d
	@./vendor/bin/sail composer install
	@./vendor/bin/sail artisan key:generate
	@./vendor/bin/sail artisan migrate:fresh --seed
	@./vendor/bin/sail npm install
	@./vendor/bin/sail npm run dev
	@echo "✅ Fresh setup complete."

# Run tests
test:
	@./vendor/bin/sail test
