"use client"
import { ConfigProvider, App } from "antd";
import { Provider } from 'react-redux';
import { store } from './store';

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 4,
                        colorBorder: "#d9d9d9"
                    },
                    components: {
                        Button: {
                            controlHeightLG: 50,
                            paddingContentHorizontal: 30,
                        },
                        Input: {
                            controlHeightLG: 50,
                            paddingInline: 16,
                        },
                        Select: {
                            controlHeightLG: 50,
                        }
                    }
                }}
            >
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </Provider>
    );
}
