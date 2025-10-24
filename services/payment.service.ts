import axiosClient from "@/config/axios.config";

// Request payload expected by the server's PaymentController
// Maps to Domain.Dtos.Requests.CreatePaymentLinkRequest
export interface CreatePaymentLinkRequest {
	OrderCode: number; // long in .NET
	Amount: number; // integer amount
	Description: string;
	ReturnUrl: string;
	CancelUrl: string;
}

export interface CreatePaymentLinkResponse {
	PaymentLink?: string;
	paymentLink?: string;
	data?: { paymentLink?: string; PaymentLink?: string };
}

function extractPaymentLink(resp: CreatePaymentLinkResponse): string | undefined {
	// Be tolerant to different casings/shapes from backend
	if (resp?.PaymentLink) return resp.PaymentLink;
	if (resp?.paymentLink) return resp.paymentLink;
	if (resp?.data?.paymentLink) return resp.data.paymentLink;
	if (resp?.data?.PaymentLink) return resp.data.PaymentLink;
	return undefined;
}

export async function createPaymentLink(
	payload: CreatePaymentLinkRequest
): Promise<string> {
		const res = await axiosClient.post<CreatePaymentLinkResponse>(
			"payments/link",
		payload
	);

	const link = extractPaymentLink(res.data);
	if (!link) {
		throw new Error("Payment link not returned by server");
	}
	return link;
}

export interface PaymentStatusResponse {
	status: string;
	paidAt?: string | null;
	amount?: number;
	currency?: string;
	failureReason?: string | null;
}

export async function getPaymentStatus(orderCode: string): Promise<PaymentStatusResponse> {
	const res = await axiosClient.get<PaymentStatusResponse>("payments/status", {
		params: { orderCode }
	});
	return res.data;
}

