const puppeteer = require("puppeteer");
const fs = require("fs");
const util = require("util");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1 }); 
  const tempEmailPage = await browser.newPage();
  const signInPage = await browser.newPage();

  const checkForCaptcha = async () => {
    try {
        await signInPage.waitForSelector('#rc-imageselect', { timeout: 10000 });
        console.log('Captcha appeared! moving on in 30 seconds');
        await util.promisify(setTimeout)(30000);

    } catch (error) {
        console.log('Captcha not found within 10 seconds.');
    }
};

  const getEmailAddress = async () => {
    // await tempEmailPage.bringToFront();
    await tempEmailPage.goto("https://tempmail.email/");
    await tempEmailPage.waitForSelector("div.email-block__genEmail");
    const emailElement = await tempEmailPage.$("div.email-block__genEmail");
    const emailAddress = await (
      await emailElement.getProperty("textContent")
    ).jsonValue();
    return emailAddress.trim();
  };
  const getEmailCode = async () => {
    // await tempEmailPage.bringToFront();
    await tempEmailPage.goto("https://tempmail.email/");
    await tempEmailPage.waitForSelector("div.header-items__refresh");
    await util.promisify(setTimeout)(2000);
    await tempEmailPage.evaluate(() => {
      const emailDiv = document.querySelector("div.header-items__refresh");
      emailDiv.click();
    });
    await util.promisify(setTimeout)(5000);
    await tempEmailPage.waitForSelector("div.receivedMail-content-cover");
    await util.promisify(setTimeout)(5000);

    await tempEmailPage.evaluate(() => {
      const emailDiv = document.querySelector("div.receivedMail-content-cover");
      emailDiv.click();
    });
    await util.promisify(setTimeout)(1000);

    await tempEmailPage.waitForSelector(
      'h1[style="font-weight: bold; font-size: 76px; line-height: 120px; margin: 56px 0 80px; text-align: center;"]'
    );

    const verificationCode = await tempEmailPage.evaluate(() => {
      const codeElement = document.querySelector(
        'h1[style="font-weight: bold; font-size: 76px; line-height: 120px; margin: 56px 0 80px; text-align: center;"]'
      );
      const codeText = codeElement.innerText.trim();
      return codeText;
    });

    console.log("Verification Code:", verificationCode);
    return verificationCode.trim();
  };

  const writeEmailAddressToFile = async (emailAddress) => {
    fs.appendFileSync("email.txt", `${emailAddress}\n`);
  };

  const makeAccount = async () => {
    const emailAddress = await getEmailAddress();
    // await signInPage.bringToFront();
    console.log("Temporary Email Address:", emailAddress);
    await writeEmailAddressToFile(emailAddress);
    await signInPage.goto("https://app.heygen.com/login");
    await signInPage.waitForSelector("._button_1b2mk_52");
    await signInPage.click("._button_1b2mk_52");
    await util.promisify(setTimeout)(1000);
    await signInPage.waitForSelector(".css-6dnw0m");
    await signInPage.click(".css-6dnw0m");
    await util.promisify(setTimeout)(2000);
    await signInPage.waitForSelector("input#email");
    await signInPage.type("input#email", emailAddress);
    await signInPage.waitForSelector(".css-o9bvpj");
    await signInPage.click(".css-o9bvpj");
    await util.promisify(setTimeout)(10000);
    await checkForCaptcha()
    const code = await getEmailCode();
    // await signInPage.bringToFront();
    await util.promisify(setTimeout)(5000);
    await signInPage.waitForSelector("input#code");
    await signInPage.type("input#code", code);
    await signInPage.waitForSelector(".css-iak95n");
    await signInPage.click(".css-iak95n");
    await util.promisify(setTimeout)(5000);
    const password = "Z00WeeM#am1";
    await signInPage.waitForSelector("input#password");
    await signInPage.type("input#password", password);
    await signInPage.waitForSelector("input#pwdConfirm");
    await signInPage.type("input#pwdConfirm", password);
    await signInPage.waitForSelector(".css-1qvqlma");
    await signInPage.click(".css-1qvqlma");
    await util.promisify(setTimeout)(80000);
    await signInPage.waitForSelector(".css-d4ovss");
    await signInPage.click(".css-d4ovss");
    // await signInPage.waitForSelector(".css-19cv3h1");
    // const selector = await signInPage.$$(".css-19cv3h1");

    // await selector[2].click('.css-19cv3h1');
    // await selector[5].click('.css-19cv3h1');
    // await selector[18].click('.css-19cv3h1');
    // await selector[29].click('.css-19cv3h1');
    // await selector[37].click('.css-19cv3h1');
    // await selector[47].click('.css-19cv3h1');
    // await signInPage.waitForSelector(".css-17onw6j");
    // await signInPage.click(".css-17onw6j");


    let counter = [2, 5, 18, 29, 37, 47]; 
    for (let i = 0; i < counter.length; i++) {
      let fr = counter[i]
      console.log('one')
        await signInPage.waitForSelector(".css-19cv3h1");
        const selector = await signInPage.$$(".css-19cv3h1");
        console.log(selector.length)
       console.log(counter)
        if (fr >= selector.length) {
            console.log("Counter exceeds array length.");
            break; 
        }
        console.log(fr)
        await util.promisify(setTimeout)(1000);
        await selector[fr].click();
        await util.promisify(setTimeout)(1000);
        await signInPage.waitForSelector(".css-17onw6j");
        await signInPage.click(".css-17onw6j");
    }
    


    // for (let i = 0; i < 5; i++) {
    //     const leftElement = await signInPage.$(".left");
    //     const rightElement = await signInPage.$(".right");
    
    
    //         // Select the third parent element that has no .left and no .right
    //         const thirdParentNoLeftRight = await signInPage.evaluate(() => {
    //             const allElements = document.querySelectorAll(".css-19cv3h1");
    //             const elementsWithoutLeftRight = Array.from(allElements).filter(element => {
    //                 const parent = element.parentElement.parentElement.parentElement;
    //                 return !parent.classList.contains("left") && !parent.classList.contains("right");
    //             });
    //             return elementsWithoutLeftRight[2]; // Selecting the third element
    //         });
    
    //         await thirdParentNoLeftRight.click();
      
    //     await signInPage.waitForSelector(".css-17onw6j");
    //     await signInPage.click(".css-17onw6j");
    // }
    
    // console.log("Cleaning!")
    // await signInPage.clearCookies();
    // await signInPage.reload();
    // await signInPage.goto("https://app.heygen.com/login");
    // await tempEmailPage.bringToFront();
    // await tempEmailPage.waitForSelector("button#js-btn-deleteEmail");
    // await tempEmailPage.click("button#js-btn-deleteEmail");
    // await util.promisify(setTimeout)(5000);
    // await tempEmailPage.reload();
    // console.log("Done!")
  };

  await makeAccount();
  await util.promisify(setTimeout)(100000);

  await browser.close();
};

const onWithDelay = async () => {
  while (true) {
    await main();
    
    console.log(
      "############################## STARTING AGAIN ##############################"
    );
  }
};

onWithDelay();
