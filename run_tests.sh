#!/bin/bash
rm -rf allure-results
npx playwright test
cp -a reports/allure-report/history allure-results/
npx allure generate allure-results --report-dir reports/allure-report --clean
git restore reports/
