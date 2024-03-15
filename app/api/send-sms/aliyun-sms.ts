import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';

export default class Client {

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(): Dysmsapi20170525 {
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
        let config = new $OpenApi.Config({
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
            accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
            accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = `dysmsapi.aliyuncs.com`;
        return new Dysmsapi20170525(config);
    }

    static async send_sms(phoneNumber: string, verificationCode: number): Promise<void> {
        let client = Client.createClient();
        let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: phoneNumber,
            signName: "AI演讲教练",
            templateCode: "SMS_295776369",
            templateParam: "{\"code\":\"" + verificationCode + "\"}",
        });
        let runtime = new $Util.RuntimeOptions({});
        await client.sendSmsWithOptions(sendSmsRequest, runtime);
    }

}