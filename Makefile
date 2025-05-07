.PHONY: up down fresh artisan npm test clean

SHELL := /bin/bash
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

# Helper to check if Sail exists
SAIL := ./vendor/bin/sail

# Start Sail containers
up:
	@echo -e "$(GREEN)[✔] Starting Laravel Sail...$(NC)"
	@$(SAIL) up -d

# Stop Sail containers
down:
	@if [ -f $(SAIL) ]; then \
		echo -e "$(GREEN)[✔] Stopping Laravel Sail...$(NC)"; \
		$(SAIL) down; \
	else \
		echo -e "$(YELLOW)[→] Skipping down — Sail not installed yet.$(NC)"; \
	fi

# Run artisan commands: make artisan ARGS="migrate"
artisan:
	@$(SAIL) artisan $(ARGS)

# Run Vite dev build
npm:
	@$(SAIL) npm install
	@$(SAIL) npm run dev

# Full setup from scratch
fresh: down
	@echo -e "$(GREEN)[🛠] Starting fresh Laravel setup...$(NC)"

	@if [ ! -f .env ]; then \
		echo -e "$(GREEN)[✔] Copying .env.example to .env$(NC)"; \
		cp .env.example .env; \
	else \
		echo -e "$(YELLOW)[→] .env already exists, skipping copy$(NC)"; \
	fi

	@if [ ! -f $(SAIL) ]; then \
		echo -e "$(GREEN)[📦] Installing Composer dependencies...$(NC)"; \
		composer install; \
	fi

	@echo -e "$(GREEN)[🐳] Starting Sail containers...$(NC)"
	@$(SAIL) up -d

	@echo -e "$(GREEN)[🔑] Generating app key...$(NC)"
	@$(SAIL) artisan key:generate

	@echo -e "$(GREEN)[⏳] Waiting for MySQL to be ready...$(NC)"
	@until $(SAIL) artisan migrate:fresh --seed; do \
		echo -e "$(YELLOW)⏳ Retrying in 3 seconds...$(NC)"; \
		sleep 3; \
	done

	@echo -e "$(GREEN)[📦] Installing NPM packages...$(NC)"
	@$(SAIL) npm install

	@echo -e "$(GREEN)[🚀] Starting Vite dev server...$(NC)"
	@$(SAIL) npm run dev

	@echo -e "$(GREEN)[✅] All done! Visit your app at http://localhost$(NC)"

# Run PHPUnit tests
test:
	@$(SAIL) test

# Remove environment & vendor files (dangerous)
clean: down
	@echo -e "$(YELLOW)[!] Removing .env, vendor, and node_modules...$(NC)"
	@rm -f .env
	@rm -rf vendor node_modules
