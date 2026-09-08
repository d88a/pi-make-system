const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true
  });

  // ── TEST 1: Calculator page — pre-fill + submit ──
  console.log('=== TEST 1: Calculator page ===');
  const page1 = await context.newPage();
  try {
    await page1.goto('https://maksplit.ru/calculator/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Loaded: calculator');

    // Check labels
    const labelExists = await page1.$('label[for="cf7-name"]');
    console.log('label[for="cf7-name"]:', !!labelExists ? '✅' : '❌');

    const submitBtn = await page1.$('input[value="Отправить заявку"]');
    console.log('Submit button "Отправить заявку":', !!submitBtn ? '✅' : '❌');

    const consentText = await page1.$('.smaks-consent');
    console.log('.smaks-consent:', !!consentText ? '✅' : '❌');

    // Select category
    await page1.selectOption('#calc-category', 'bruschatka');
    await page1.waitForTimeout(500);

    // Select color "Серый" (already checked by default)
    // Enter area
    await page1.fill('#calc-area', '50');
    await page1.waitForTimeout(1000); // wait for calculation

    // Check result
    const resultText = await page1.$eval('#calc-result', el => el.textContent.trim());
    console.log('Result:', resultText);

    // Check pre-fill in your-message
    const messageValue = await page1.$eval('textarea[name="your-message"]', el => el.value);
    console.log('Pre-fill message value:');
    console.log(messageValue);

    const hasCategory = messageValue.includes('Категория: Брусчатка');
    const hasColor = messageValue.includes('Цвет: Серый');
    const hasArea = messageValue.includes('Площадь: 50');
    const hasTotal = messageValue.includes('Итого:');
    console.log('  Contains "Категория: Брусчатка":', hasCategory ? '✅' : '❌');
    console.log('  Contains "Цвет: Серый":', hasColor ? '✅' : '❌');
    console.log('  Contains "Площадь: 50":', hasArea ? '✅' : '❌');
    console.log('  Contains "Итого:":', hasTotal ? '✅' : '❌');
    const prefillOK = hasCategory && hasColor && hasArea && hasTotal;
    console.log('PRE-FILL:', prefillOK ? '✅ WORKS' : '❌ FAILED');

    // Fill name and phone
    await page1.fill('input[name="your-name"]', 'Тест Калькулятор');
    await page1.fill('input[name="your-phone"]', '+7 (999) 123-45-67');

    // Submit form
    const submitBtnEl = await page1.$('input[value="Отправить заявку"]');
    await submitBtnEl.click();
    await page1.waitForTimeout(3000);

    // Check form result
    const sentOutput = await page1.$('.wpcf7-form.sent');
    const responseOutput = await page1.$('.wpcf7-response-output');
    const responseText = responseOutput ? await responseOutput.textContent() : '';
    console.log('Form sent class:', !!sentOutput ? '✅' : '❌');
    console.log('Response text:', responseText.trim());

    // Screenshot
    await page1.screenshot({ path: 'D:/pi/projects/maksplit/form_calc_prefill.png', fullPage: true });
    console.log('Screenshot: D:/pi/projects/maksplit/form_calc_prefill.png');

  } catch (err) {
    console.error('ERROR on calculator:', err.message);
  } finally {
    await page1.close();
  }

  // ── TEST 2: Home page — labels + no pre-fill + submit ──
  console.log('\n=== TEST 2: Home page ===');
  const page2 = await context.newPage();
  try {
    await page2.goto('https://maksplit.ru/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Loaded: home');

    // Check labels
    const labelExists2 = await page2.$('label[for="cf7-name"]');
    console.log('label[for="cf7-name"]:', !!labelExists2 ? '✅' : '❌');

    const submitBtn2 = await page2.$('input[value="Отправить заявку"]');
    console.log('Submit button "Отправить заявку":', !!submitBtn2 ? '✅' : '❌');

    // Check your-message is NOT pre-filled (no calculator)
    const messageValue2 = await page2.$eval('textarea[name="your-message"]', el => el.value);
    const hasCalcRef = messageValue2.includes('Заявка с калькулятора');
    console.log('your-message has "Заявка с калькулятора":', hasCalcRef ? '❌ BAD (should NOT pre-fill)' : '✅ OK (empty)');
    console.log('your-message value:', messageValue2 || '(empty)');

    // Fill name and phone
    await page2.fill('input[name="your-name"]', 'Тест Главная');
    await page2.fill('input[name="your-phone"]', '+7 (999) 987-65-43');

    // Submit form
    const submitBtnEl2 = await page2.$('input[value="Отправить заявку"]');
    await submitBtnEl2.click();
    await page2.waitForTimeout(3000);

    const sentOutput2 = await page2.$('.wpcf7-form.sent');
    const responseOutput2 = await page2.$('.wpcf7-response-output');
    const responseText2 = responseOutput2 ? await responseOutput2.textContent() : '';
    console.log('Form sent class:', !!sentOutput2 ? '✅' : '❌');
    console.log('Response text:', responseText2.trim());

    // Screenshot
    await page2.screenshot({ path: 'D:/pi/projects/maksplit/form_home_labels.png', fullPage: true });
    console.log('Screenshot: D:/pi/projects/maksplit/form_home_labels.png');

  } catch (err) {
    console.error('ERROR on home:', err.message);
  } finally {
    await page2.close();
  }

  await browser.close();
  console.log('\n=== DONE ===');
})();