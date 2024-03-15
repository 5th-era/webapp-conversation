"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useTranslation } from 'react-i18next'

async function sendVerificationCode(phoneNumber: string, setInfoHandler: any) {
    const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
    });
    // 处理响应
    const data = await response.text();
    const parsedData = JSON.parse(data);
    const { message } = parsedData;
    if (!response.ok) {
        // 显示错误消息
        alert(message);
        return;
    }

    setInfoHandler(message);
    // 获取发送按钮
    var sendButton = document.getElementById('sendButton') as HTMLButtonElement;
    // 禁用发送按钮
    if (!sendButton) return;

    sendButton.disabled = true;
    // 开始50秒倒计时
    var timeLeft = 60;
    var textContent = '';

    // 每秒更新一次倒计时
    var timerId = setInterval(function () {
        timeLeft--;
        textContent = timeLeft + ' S';
        if (timeLeft <= 0) {
            clearInterval(timerId);
            sendButton.disabled = false;
            sendButton.textContent = "发送验证码";
        }
        else {
            sendButton.disabled = true;
            sendButton.textContent = textContent;
        }
    }, 1000);

    return;
}

export const LoginForm = () => {
    const router = useRouter();
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        phoneNumber: "",
        verifyCode: "",
    });
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const onSubmit = async (e: React.FormEvent) => {
        console.log("enter onSubmit: ");
        e.preventDefault();
        try {
            setLoading(true);
            setFormValues({ phoneNumber: "", verifyCode: "" });

            const res = await signIn("credentials", {
                redirect: false,
                phoneNumber: formValues.phoneNumber,
                verifyCode: formValues.verifyCode,
                callbackUrl,
            });

            setLoading(false);

            console.log(res);
            if (!res?.error) {
                router.push(callbackUrl);
            } else {
                alert("验证失败，请重试。")
            }
        } catch (error: any) {
            setLoading(false);
            setError(error);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const input_style =
        "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
    const input_style_70 =
        "form-control block w-7/10 px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
    const input_style_30 =
        "form-control block w-3/10 px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

    return (
        <form onSubmit={onSubmit}>
            <p className="text-center bg-green-600 text-white py-4 mb-6 rounded">请先登录</p>
            {error && (
                <p className="text-center bg-red-400 py-4 mb-6 rounded">{error}</p>
            )}
            <div className="mb-6">
                <input
                    required
                    type="text"
                    name="phoneNumber"
                    value={formValues.phoneNumber}
                    onChange={handleChange}
                    placeholder={t('common.auth.phoneNumber') as string}
                    className={`${input_style}`}
                />
            </div>
            <button
                id="sendButton"
                type="button"
                onClick={() => sendVerificationCode(formValues.phoneNumber, setError)}
                className="inline-block px-7 py-4 bg-blue-400 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                disabled={false}
            >
                {t('common.auth.sendCode')}
            </button>
            <div className="mb-6">
                <input
                    required
                    type="text"
                    name="verifyCode"
                    value={formValues.verifyCode}
                    onChange={handleChange}
                    placeholder={t('common.auth.verifyCode') as string}
                    className={`${input_style}`}
                />
            </div>
            <button
                type="submit"
                // style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
                className="inline-block px-7 py-4 bg-blue-400 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                disabled={loading}
            >
                {loading ? "登录中..." : "登录"}
            </button>

            {/* <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <a
                className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                style={{ backgroundColor: "#3b5998" }}
                onClick={() => alert("Not implemented yet")}
                role="button"
            >
                <img
                    className="pr-2"
                    src="/images/weixin.png"
                    alt=""
                    style={{ height: "2rem" }}
                />
                用微信直接登录
            </a> */}

        </form >
    );
};
