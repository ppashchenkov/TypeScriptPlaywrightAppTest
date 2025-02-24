#!/bin/bash
rm -rf allure-results
npx playwright test
cp -a reports/allure-report/history allure-results/
allure generate --clean --output reports/allure-report
