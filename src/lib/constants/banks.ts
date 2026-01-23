export interface BankInfo {
  code: string
  name: string
  displayName: string
}

export const KOREAN_BANKS: BankInfo[] = [
  { code: '004', name: 'KB국민은행', displayName: 'KB국민은행' },
  { code: '088', name: '신한은행', displayName: '신한은행' },
  { code: '081', name: '하나은행', displayName: '하나은행' },
  { code: '020', name: '우리은행', displayName: '우리은행' },
  { code: '003', name: '기업은행', displayName: 'IBK기업은행' },
  { code: '011', name: '농협', displayName: 'NH농협은행' },
  { code: '023', name: 'SC제일은행', displayName: 'SC제일은행' },
  { code: '027', name: '시티은행', displayName: '한국시티은행' },
  { code: '031', name: '대구은행', displayName: '대구은행' },
  { code: '032', name: '부산은행', displayName: '부산은행' },
  { code: '034', name: '광주은행', displayName: '광주은행' },
  { code: '035', name: '제주은행', displayName: '제주은행' },
  { code: '037', name: '전북은행', displayName: '전북은행' },
  { code: '039', name: '경남은행', displayName: '경남은행' },
  { code: '045', name: '새마을금고', displayName: '새마을금고' },
  { code: '048', name: '신협', displayName: '신협중앙회' },
  { code: '050', name: '상호저축은행', displayName: '상호저축은행' },
  { code: '071', name: '우체국', displayName: '우체국예금보험' },
  { code: '089', name: '케이뱅크', displayName: '케이뱅크' },
  { code: '090', name: '카카오뱅크', displayName: '카카오뱅크' },
  { code: '092', name: '토스뱅크', displayName: '토스뱅크' },
]

export const getBankByCode = (code: string): BankInfo | undefined => {
  return KOREAN_BANKS.find((bank) => bank.code === code)
}

export const getBankByName = (name: string): BankInfo | undefined => {
  return KOREAN_BANKS.find((bank) => bank.name === name || bank.displayName === name)
}

export const validateAccountNumber = (accountNumber: string): boolean => {
  if (!accountNumber) return false

  // Remove hyphens and spaces
  const cleanNumber = accountNumber.replace(/[-\s]/g, '')

  // Basic length validation (Korean banks typically use 10-14 digits)
  if (cleanNumber.length < 8 || cleanNumber.length > 20) return false

  // Only allow numbers
  if (!/^\d+$/.test(cleanNumber)) return false

  return true
}

export const formatAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return ''

  // Remove all non-digits
  const cleanNumber = accountNumber.replace(/\D/g, '')

  // Add hyphens for better readability (general format)
  if (cleanNumber.length >= 6) {
    return cleanNumber.replace(/(\d{3,4})(\d{2,4})(\d{2,4})(\d*)/g, (match, p1, p2, p3, p4) => {
      let result = p1
      if (p2) result += '-' + p2
      if (p3) result += '-' + p3
      if (p4) result += '-' + p4
      return result
    })
  }

  return cleanNumber
}
