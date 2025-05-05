"use client";
import { ConfigProvider, App } from "antd";
import { Provider } from "react-redux";
import { store } from "../store";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import { useMemo } from "react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cache = useMemo<Entity>(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return (
    <StyleProvider cache={cache}>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 4,
              colorBorder: "#d9d9d9",
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
              },
            },
          }}
        >
          <App>{children}</App>
        </ConfigProvider>
      </Provider>
    </StyleProvider>
  );
}
