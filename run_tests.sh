#!/bin/bash
rm -rf allure-results
npx playwright test
cp -a allure-report/history allure-results/
npx allure generate allure-results --clean
