// verificationStore.js

// 创建并导出一个Map来存储验证码
const verificationCodes = new Map();

function generateVerificationCode(phoneNumber: string) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.info("generateVerificationCode phoneNumber:", phoneNumber);
    console.info('generateVerificationCode code:', verificationCode);

    if (storeVerificationCode(phoneNumber, verificationCode.toString())) return verificationCode;
    else return -1;
}

function storeVerificationCode(phoneNumber: string, code: string) {
    // 存储验证码
    verificationCodes.set(phoneNumber, code);

    // 设置5分钟后过期
    setTimeout(() => {
        console.info("delete phoneNumber:", phoneNumber);
        console.info("delete verifycode:", verificationCodes.get(phoneNumber));
        verificationCodes.delete(phoneNumber);
    }, 60000 * 5); // 5分钟 = 300000毫秒

    return true;
}

function verify_code(phoneNumber: string, code: string) {
    // 检查验证码是否存在且匹配
    if (verificationCodes.has(phoneNumber) && verificationCodes.get(phoneNumber) === code) {
        // 验证码匹配
        verificationCodes.delete(phoneNumber); // 验证成功后删除验证码
        return true;
    }
    // 验证码不存在或不匹配
    return false;
}

function isValidPhoneNumber(phoneNumber: any) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phoneNumber);
}

export { generateVerificationCode, verify_code, isValidPhoneNumber }

