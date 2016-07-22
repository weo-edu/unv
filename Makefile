#
# Vars
#

BIN = ./node_modules/.bin
.DEFAULT_GOAL := all

#
# Tasks
#

node_modules: package.json
	@npm install
	@touch node_modules

test: node_modules
	@${BIN}/tape test/*.js

validate: node_modules
	@standard

all: validate test

#
# Phony
#

.PHONY: test validate clean build
