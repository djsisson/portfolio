import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	output: "standalone",
	images: {
		minimumCacheTTL: 60 * 60 * 24 * 7 * 4,
		localPatterns: [
			{
				pathname: "/assets/**",
				search: "",
			},
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.googleusercontent.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "r2.djadetech.com",
				port: "",
				pathname: "**",
			},
		],
	},
	env: {
		NEXT_PUBLIC_SITE: "https://djadetech.com",
	},
	async headers() {
		return [
			{
				source: "/assets/:slug*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
