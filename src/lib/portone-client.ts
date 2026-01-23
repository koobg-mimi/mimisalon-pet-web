/**
 * PortOne 파트너 정산 자동화 API 클라이언트
 *
 * 이 클라이언트는 PortOne의 파트너 정산 API와 통신하여
 * 파트너 관리, 계약 관리, 정산 처리를 담당합니다.
 */

import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

// PortOne Platform API 타입 정의 (공식 SDK와 호환되는 구조)
export interface PlatformPartner {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  defaultContractId: string;
  account: {
    bank: string;
    number: string;
    holder: string;
    currency: string;
  };
  contact?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  type: 'BUSINESS' | 'NON_BUSINESS';
  tags?: string[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformPartnerBody {
  id?: string;
  name: string;
  type: 'BUSINESS' | 'NON_BUSINESS';
  contact?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  account: {
    bank: string;
    number: string;
    holder: string;
    currency?: string;
  };
  defaultContractId: string;
  memo?: string;
  tags?: string[];
}

export interface UpdatePlatformPartnerBody {
  name?: string;
  contact?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  account?: {
    bank: string;
    number: string;
    holder: string;
    currency?: string;
  };
  memo?: string;
  tags?: string[];
}

export interface PlatformPartnerFilterInput {
  ids?: string[];
  keyword?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface PlatformContract {
  id: string;
  name: string;
  platformFee: {
    type: 'FIXED_AMOUNT' | 'RATIO';
    amount?: number;
    rate?: number;
  };
  settlementCycle: {
    method: 'WEEKLY' | 'MONTHLY';
    lagDays: number;
  };
}

export interface CreatePlatformOrderTransferBody {
  partnerId: string;
  contractId?: string;
  memo?: string;
  orderDetail: {
    orderId: string;
    orderName?: string;
  };
  transferAmount: number;
  taxFreeTransferAmount?: number;
  discountAmount?: number;
  additionalFeeAmount?: number;
  externalCancellationDetail?: {
    cancelledAt: string;
    reason?: string;
  };
  userDefinedProperties?: Record<string, unknown>;
}

export interface PlatformTransfer {
  id: string;
  type: 'ORDER' | 'ORDER_CANCEL' | 'MANUAL';
  partnerId: string;
  status: 'SCHEDULED' | 'IN_PROCESS' | 'SETTLED' | 'CANCELLED';
  memo?: string;
  settlementAmount: number;
  settlementCurrency: string;
  partnerSettlementAmount?: number;
  platformFeeAmount?: number;
  discountAmount?: number;
  additionalFeeAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformPartnerSettlement {
  id: string;
  partnerId: string;
  type: 'SCHEDULED' | 'MANUAL';
  status:
    | 'PAYOUT_SCHEDULED'
    | 'PAYOUT_PREPARED'
    | 'PAYOUT_WITHHELD'
    | 'PAYOUT_FAILED'
    | 'IN_PAYOUT'
    | 'PAID_OUT'
    | 'CANCELLED';
  settlementAmount: number;
  settlementCurrency: string;
  settlementDate: string;
  transferIds: string[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformPartnerSettlementFilterInput {
  partnerIds?: string[];
  statuses?: string[];
  settlementDates?: {
    from?: string;
    until?: string;
  };
}

export interface PageInfo {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface CreatePlatformBulkPayoutBody {
  partnerSettlementIds: string[];
  memo?: string;
}

export interface PlatformBulkPayout {
  id: string;
  status: 'PREPARED' | 'CANCELLED' | 'STOPPED' | 'PROCESSING' | 'COMPLETED' | 'SCHEDULED';
  totalAmount: number;
  totalCount: number;
  currency: string;
  memo?: string;
  partnerSettlementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformError {
  type: string;
  message: string;
}

// PortOne API 타입 정의
export interface PortOneConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  isProduction?: boolean;
}

// 공식 SDK 타입을 re-export하여 사용
export type PortOnePartner = PlatformPartner;
export type PortOneContract = PlatformContract;
export type CreatePartnerRequest = CreatePlatformPartnerBody;
export type UpdatePartnerRequest = UpdatePlatformPartnerBody;
export type CreateOrderTransferRequest = CreatePlatformOrderTransferBody;
export type PortOneTransfer = PlatformTransfer;
export type PortOnePartnerSettlement = PlatformPartnerSettlement;
export type CreateBulkPayoutRequest = CreatePlatformBulkPayoutBody;
export type PortOneBulkPayout = PlatformBulkPayout;
export type PortOneApiError = PlatformError;

/**
 * PortOne API 클라이언트 클래스
 */
export class PortOneClient {
  private config: PortOneConfig;
  private baseUrl: string;

  constructor(config: PortOneConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.portone.io';
  }

  /**
   * API 요청을 보내는 공통 메서드
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `PortOne ${this.config.apiSecret}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `PortOne API Error: ${response.status} ${response.statusText} - ${
          errorData?.message || 'Unknown error'
        }`
      );
    }

    return response.json();
  }

  /**
   * 파트너 관리 API
   */
  async createPartner(request: CreatePartnerRequest): Promise<PortOnePartner> {
    return this.makeRequest<PortOnePartner>('/platform/partners', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getPartner(partnerId: string): Promise<PortOnePartner> {
    return this.makeRequest<PortOnePartner>(`/platform/partners/${partnerId}`);
  }

  async updatePartner(partnerId: string, updates: UpdatePartnerRequest): Promise<PortOnePartner> {
    return this.makeRequest<PortOnePartner>(`/platform/partners/${partnerId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async listPartners(
    filters?: PlatformPartnerFilterInput,
    page?: { number?: number; size?: number }
  ): Promise<{
    items: PortOnePartner[];
    page: { number: number; size: number };
    totalCount: number;
  }> {
    const params = new URLSearchParams();

    if (filters?.ids) {
      filters.ids.forEach((id) => params.append('id', id));
    }
    if (filters?.keyword) params.set('keyword', filters.keyword);
    if (filters?.tags) {
      filters.tags.forEach((tag) => params.append('tag', tag));
    }
    if (filters?.isArchived !== undefined) {
      params.set('isArchived', filters.isArchived.toString());
    }

    if (page?.number) params.set('page[number]', page.number.toString());
    if (page?.size) params.set('page[size]', page.size.toString());

    const query = params.toString();
    const endpoint = `/platform/partners${query ? `?${query}` : ''}`;

    return this.makeRequest(endpoint);
  }

  /**
   * 계약 관리 API
   */
  async getContract(contractId: string): Promise<PortOneContract> {
    return this.makeRequest<PortOneContract>(`/platform/contracts/${contractId}`);
  }

  async listContracts(): Promise<{ items: PortOneContract[] }> {
    return this.makeRequest<{ items: PortOneContract[] }>('/platform/contracts');
  }

  /**
   * 정산 건 관리 API
   */
  async createOrderTransfer(request: CreateOrderTransferRequest): Promise<PortOneTransfer> {
    return this.makeRequest<PortOneTransfer>('/platform/transfers/order', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getTransfer(transferId: string): Promise<PortOneTransfer> {
    return this.makeRequest<PortOneTransfer>(`/platform/transfers/${transferId}`);
  }

  async listTransfers(
    filters?: {
      partnerIds?: string[];
      statuses?: string[];
      keyword?: string;
    },
    page?: { number?: number; size?: number }
  ): Promise<{ items: PortOneTransfer[]; page: PageInfo; totalCount: number }> {
    const params = new URLSearchParams();

    if (filters?.partnerIds) {
      filters.partnerIds.forEach((id) => params.append('partnerId', id));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('status', status));
    }
    if (filters?.keyword) params.set('keyword', filters.keyword);

    if (page?.number) params.set('page[number]', page.number.toString());
    if (page?.size) params.set('page[size]', page.size.toString());

    const query = params.toString();
    const endpoint = `/platform/transfers${query ? `?${query}` : ''}`;

    return this.makeRequest(endpoint);
  }

  /**
   * 파트너 정산 관리 API
   */
  async getPartnerSettlement(settlementId: string): Promise<PortOnePartnerSettlement> {
    return this.makeRequest<PortOnePartnerSettlement>(
      `/platform/partner-settlements/${settlementId}`
    );
  }

  async listPartnerSettlements(
    filters?: PlatformPartnerSettlementFilterInput,
    page?: { number?: number; size?: number }
  ): Promise<{
    items: PortOnePartnerSettlement[];
    page: PageInfo;
    totalCount: number;
  }> {
    const params = new URLSearchParams();

    if (filters?.partnerIds) {
      filters.partnerIds.forEach((id) => params.append('partnerId', id));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('status', status));
    }
    if (filters?.settlementDates?.from) {
      params.set('settlementDate[from]', filters.settlementDates.from);
    }
    if (filters?.settlementDates?.until) {
      params.set('settlementDate[until]', filters.settlementDates.until);
    }

    if (page?.number) params.set('page[number]', page.number.toString());
    if (page?.size) params.set('page[size]', page.size.toString());

    const query = params.toString();
    const endpoint = `/platform/partner-settlements${query ? `?${query}` : ''}`;

    return this.makeRequest(endpoint);
  }

  /**
   * 일괄 지급 API
   */
  async createBulkPayout(request: CreateBulkPayoutRequest): Promise<PortOneBulkPayout> {
    return this.makeRequest<PortOneBulkPayout>('/platform/bulk-payouts', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getBulkPayout(bulkPayoutId: string): Promise<PortOneBulkPayout> {
    return this.makeRequest<PortOneBulkPayout>(`/platform/bulk-payouts/${bulkPayoutId}`);
  }

  /**
   * 헬퍼 메서드들
   */

  /**
   * 미용사 프로필 기반으로 파트너 ID 생성
   */
  generatePartnerId(groomerId: string): string {
    return `groomer_${groomerId}`;
  }

  /**
   * 정산 주기를 PortOne 형식으로 변환
   */
  convertSettlementCycle(cycle: string): PlatformContract['settlementCycle'] {
    switch (cycle) {
      case 'WEEKLY_TUESDAY':
        return { method: 'WEEKLY', lagDays: 2 }; // 화요일 정산 (2일 지연)
      case 'MONTHLY':
        return { method: 'MONTHLY', lagDays: 3 }; // 월말 정산 (3일 지연)
      default:
        return { method: 'WEEKLY', lagDays: 2 };
    }
  }

  /**
   * 날짜를 PortOne API 형식으로 변환 (YYYY-MM-DD)
   * @param date - 변환할 날짜
   * @returns YYYY-MM-DD 형식의 문자열
   */
  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd', { locale: ko });
  }

  /**
   * API 에러 처리 헬퍼
   */
  isPortOneError(error: unknown): error is PortOneApiError {
    return (
      error != null &&
      typeof error === 'object' &&
      'type' in error &&
      'message' in error &&
      typeof (error as Record<string, unknown>).type === 'string' &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
}

/**
 * 싱글톤 PortOne 클라이언트 인스턴스
 */
let portOneClient: PortOneClient | null = null;

export function getPortOneClient(): PortOneClient {
  if (!portOneClient) {
    const config: PortOneConfig = {
      apiKey: process.env.PORTONE_API_KEY || '',
      apiSecret: process.env.PORTONE_API_SECRET || '',
      baseUrl: process.env.PORTONE_API_BASE_URL || 'https://api.portone.io',
      isProduction: process.env.NODE_ENV === 'production',
    };

    if (!config.apiKey || !config.apiSecret) {
      throw new Error('PortOne API credentials are not configured');
    }

    portOneClient = new PortOneClient(config);
  }

  return portOneClient;
}

/**
 * PortOne 기능 활성화 여부 확인
 */
export function isPortOneEnabled(): boolean {
  return process.env.PORTONE_PLATFORM_ENABLED === 'true';
}
