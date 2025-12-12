"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
	const router = useRouter();
	const [documentMounted, setDocumentMounted] = useState(false);
	useEffect(() => {
		setDocumentMounted(true);
	}, []);

	const handleClose = () => {
		router.replace("/tilez");
	};

	return documentMounted
		? createPortal(
				<button
					type="button"
					className="modal absolute inset-0 flex items-center justify-center overflow-clip backdrop-blur-sm"
					onClick={() => {
						handleClose();
					}}
				>
					<button
						type="button"
						className="cursor-default"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<div className="animate-appear-up rounded-lg bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
							<div className="bg-secondary flex flex-col gap-4 rounded-lg p-4">
								<div className="p-10">
									<h1>
										Welcome to Tilez! The game which shall meet all your
										vocabulary needs!
									</h1>
									<h2 className="py-10">Created by Darren Sisson.</h2>
									<div className="flex w-full justify-end">
										<Button onClick={handleClose}>Close</Button>
									</div>
								</div>
							</div>
						</div>
					</button>
				</button>,
				document.body,
			)
		: null;
};

export default AboutPage;
