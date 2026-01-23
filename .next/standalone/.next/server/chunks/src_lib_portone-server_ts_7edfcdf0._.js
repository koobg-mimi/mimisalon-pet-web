module.exports = [
  378725,
  (e) => {
    'use strict'
    var t = e.i(518184)
    class o extends t.PortOneError {
      data
      constructor(e) {
        ;(super('message' in e ? e.message : void 0), (this.data = e))
      }
    }
    class r extends o {}
    class n extends r {}
    let s = 'portone-server-sdk-js/js-v0.17.0'
    class a extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, a.prototype),
          (this.name = 'GetB2bBulkTaxInvoiceError'))
      }
    }
    class i extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, i.prototype),
          (this.name = 'CreateB2bFileUploadUrlError'))
      }
    }
    class c extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, c.prototype),
          (this.name = 'DownloadB2bTaxInvoicesSheetError'))
      }
    }
    class h extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, h.prototype),
          (this.name = 'UpdateB2bTaxInvoiceDraftError'))
      }
    }
    class l extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, l.prototype),
          (this.name = 'DraftB2bTaxInvoiceError'))
      }
    }
    class p extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, p.prototype),
          (this.name = 'IssueB2bTaxInvoiceImmediatelyError'))
      }
    }
    class d extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, d.prototype),
          (this.name = 'RequestB2bTaxInvoiceReverseIssuanceError'))
      }
    }
    class f extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, f.prototype),
          (this.name = 'AttachB2bTaxInvoiceFileError'))
      }
    }
    class u extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, u.prototype),
          (this.name = 'DeleteB2bTaxInvoiceAttachmentError'))
      }
    }
    class y extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, y.prototype),
          (this.name = 'GetB2bTaxInvoiceAttachmentsError'))
      }
    }
    class m extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, m.prototype),
          (this.name = 'CancelB2bTaxInvoiceIssuanceError'))
      }
    }
    class w extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, w.prototype),
          (this.name = 'CancelB2bTaxInvoiceRequestError'))
      }
    }
    class P extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, P.prototype),
          (this.name = 'IssueB2bTaxInvoiceError'))
      }
    }
    class O extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, O.prototype),
          (this.name = 'GetB2bTaxInvoicePdfDownloadUrlError'))
      }
    }
    class j extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, j.prototype),
          (this.name = 'GetB2bTaxInvoicePopupUrlError'))
      }
    }
    class U extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, U.prototype),
          (this.name = 'GetB2bTaxInvoicePrintUrlError'))
      }
    }
    class $ extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, $.prototype),
          (this.name = 'RefuseB2bTaxInvoiceRequestError'))
      }
    }
    class b extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, b.prototype),
          (this.name = 'requestB2bTaxInvoiceError'))
      }
    }
    class g extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, g.prototype),
          (this.name = 'SendToNtsB2bTaxInvoiceError'))
      }
    }
    class A extends n {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, A.prototype), (this.name = 'GetB2bTaxInvoiceError'))
      }
    }
    class R extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, R.prototype),
          (this.name = 'DeleteB2bTaxInvoiceError'))
      }
    }
    class I extends n {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, I.prototype),
          (this.name = 'GetB2bTaxInvoicesError'))
      }
    }
    class x extends o {}
    class E extends x {}
    class T extends E {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, T.prototype),
          (this.name = 'GetB2bBusinessInfosError'))
      }
    }
    class S extends E {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, S.prototype),
          (this.name = 'GetPlatformCompanyStateError'))
      }
    }
    class C extends x {}
    class k extends C {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, k.prototype),
          (this.name = 'GetPlatformAccountTransfersError'))
      }
    }
    class L extends x {}
    class z extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, z.prototype),
          (this.name = 'GetPlatformAdditionalFeePoliciesError'))
      }
    }
    class v extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, v.prototype),
          (this.name = 'CreatePlatformAdditionalFeePolicyError'))
      }
    }
    class B extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, B.prototype),
          (this.name = 'GetPlatformAdditionalFeePolicyError'))
      }
    }
    class G extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, G.prototype),
          (this.name = 'UpdatePlatformAdditionalFeePolicyError'))
      }
    }
    class N extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, N.prototype),
          (this.name = 'ArchivePlatformAdditionalFeePolicyError'))
      }
    }
    class J extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, J.prototype),
          (this.name = 'RecoverPlatformAdditionalFeePolicyError'))
      }
    }
    class M extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, M.prototype),
          (this.name = 'GetPlatformContractsError'))
      }
    }
    class D extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, D.prototype),
          (this.name = 'CreatePlatformContractError'))
      }
    }
    class F extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, F.prototype),
          (this.name = 'GetPlatformContractError'))
      }
    }
    class q extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, q.prototype),
          (this.name = 'UpdatePlatformContractError'))
      }
    }
    class K extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, K.prototype),
          (this.name = 'ArchivePlatformContractError'))
      }
    }
    class V extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, V.prototype),
          (this.name = 'RecoverPlatformContractError'))
      }
    }
    class H extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, H.prototype),
          (this.name = 'GetPlatformDiscountSharePoliciesError'))
      }
    }
    class W extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, W.prototype),
          (this.name = 'CreatePlatformDiscountSharePolicyError'))
      }
    }
    class _ extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, _.prototype),
          (this.name = 'GetPlatformDiscountSharePolicyError'))
      }
    }
    class Q extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, Q.prototype),
          (this.name = 'UpdatePlatformDiscountSharePolicyError'))
      }
    }
    class X extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, X.prototype),
          (this.name = 'ArchivePlatformDiscountSharePolicyError'))
      }
    }
    class Y extends L {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, Y.prototype),
          (this.name = 'RecoverPlatformDiscountSharePolicyError'))
      }
    }
    class Z extends x {}
    class ee extends Z {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ee.prototype),
          (this.name = 'GetPlatformAccountHolderError'))
      }
    }
    class et extends x {}
    class eo extends et {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eo.prototype),
          (this.name = 'GetPlatformBulkAccountTransfersError'))
      }
    }
    class er extends x {}
    class en extends er {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, en.prototype),
          (this.name = 'GetPlatformBulkPayoutsError'))
      }
    }
    class es extends x {}
    class ea extends es {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ea.prototype),
          (this.name = 'GetPlatformPartnerSettlementsError'))
      }
    }
    class ei extends x {}
    class ec extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ec.prototype),
          (this.name = 'GetPlatformPartnersError'))
      }
    }
    class eh extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eh.prototype),
          (this.name = 'CreatePlatformPartnerError'))
      }
    }
    class el extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, el.prototype),
          (this.name = 'CreatePlatformPartnersError'))
      }
    }
    class ep extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ep.prototype),
          (this.name = 'ConnectBulkPartnerMemberCompanyError'))
      }
    }
    class ed extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ed.prototype),
          (this.name = 'ConnectPartnerMemberCompanyError'))
      }
    }
    class ef extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ef.prototype),
          (this.name = 'DisconnectBulkPartnerMemberCompanyError'))
      }
    }
    class eu extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eu.prototype),
          (this.name = 'DisconnectPartnerMemberCompanyError'))
      }
    }
    class ey extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ey.prototype),
          (this.name = 'GetPlatformPartnerError'))
      }
    }
    class em extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, em.prototype),
          (this.name = 'UpdatePlatformPartnerError'))
      }
    }
    class ew extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ew.prototype),
          (this.name = 'ArchivePlatformPartnerError'))
      }
    }
    class eP extends ei {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eP.prototype),
          (this.name = 'RecoverPlatformPartnerError'))
      }
    }
    class eO extends x {}
    class ej extends eO {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ej.prototype),
          (this.name = 'GetPlatformPayoutsError'))
      }
    }
    class eU extends x {}
    class e$ extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e$.prototype),
          (this.name = 'DownloadPlatformTransferSheetError'))
      }
    }
    class eb extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eb.prototype),
          (this.name = 'GetPlatformTransferSummariesError'))
      }
    }
    class eg extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eg.prototype),
          (this.name = 'CreatePlatformManualTransferError'))
      }
    }
    class eA extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eA.prototype),
          (this.name = 'CreatePlatformOrderTransferError'))
      }
    }
    class eR extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eR.prototype),
          (this.name = 'CreatePlatformOrderCancelTransferError'))
      }
    }
    class eI extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eI.prototype),
          (this.name = 'GetPlatformTransferError'))
      }
    }
    class ex extends eU {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ex.prototype),
          (this.name = 'DeletePlatformTransferError'))
      }
    }
    class eE extends x {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, eE.prototype), (this.name = 'GetPlatformError'))
      }
    }
    class eT extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eT.prototype),
          (this.name = 'GetPlatformAdditionalFeePolicyScheduleError'))
      }
    }
    class eS extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eS.prototype),
          (this.name = 'RescheduleAdditionalFeePolicyError'))
      }
    }
    class eC extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eC.prototype),
          (this.name = 'ScheduleAdditionalFeePolicyError'))
      }
    }
    class ek extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ek.prototype),
          (this.name = 'CancelPlatformAdditionalFeePolicyScheduleError'))
      }
    }
    class eL extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eL.prototype),
          (this.name = 'GetPlatformContractScheduleError'))
      }
    }
    class ez extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ez.prototype),
          (this.name = 'RescheduleContractError'))
      }
    }
    class ev extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ev.prototype),
          (this.name = 'ScheduleContractError'))
      }
    }
    class eB extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eB.prototype),
          (this.name = 'CancelPlatformContractScheduleError'))
      }
    }
    class eG extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eG.prototype),
          (this.name = 'GetPlatformDiscountSharePolicyScheduleError'))
      }
    }
    class eN extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eN.prototype),
          (this.name = 'RescheduleDiscountSharePolicyError'))
      }
    }
    class eJ extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eJ.prototype),
          (this.name = 'ScheduleDiscountSharePolicyError'))
      }
    }
    class eM extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eM.prototype),
          (this.name = 'CancelPlatformDiscountSharePolicyScheduleError'))
      }
    }
    class eD extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eD.prototype),
          (this.name = 'GetPlatformDiscountSharePolicyFilterOptionsError'))
      }
    }
    class eF extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eF.prototype),
          (this.name = 'GetPlatformPartnerFilterOptionsError'))
      }
    }
    class eq extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eq.prototype),
          (this.name = 'SchedulePlatformPartnersError'))
      }
    }
    class eK extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eK.prototype),
          (this.name = 'GetPlatformPartnerScheduleError'))
      }
    }
    class eV extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eV.prototype),
          (this.name = 'ReschedulePartnerError'))
      }
    }
    class eH extends x {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, eH.prototype), (this.name = 'SchedulePartnerError'))
      }
    }
    class eW extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eW.prototype),
          (this.name = 'CancelPlatformPartnerScheduleError'))
      }
    }
    class e_ extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e_.prototype),
          (this.name = 'GetPlatformSettingError'))
      }
    }
    class eQ extends x {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eQ.prototype),
          (this.name = 'UpdatePlatformSettingError'))
      }
    }
    class eX extends o {}
    class eY extends eX {}
    class eZ extends eY {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, eZ.prototype),
          (this.name = 'GetBillingKeyInfosError'))
      }
    }
    class e2 extends eY {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, e2.prototype), (this.name = 'IssueBillingKeyError'))
      }
    }
    class e1 extends eY {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e1.prototype),
          (this.name = 'ConfirmBillingKeyError'))
      }
    }
    class e7 extends eY {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e7.prototype),
          (this.name = 'ConfirmBillingKeyIssueAndPayError'))
      }
    }
    class e0 extends eY {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e0.prototype),
          (this.name = 'GetBillingKeyInfoError'))
      }
    }
    class e5 extends eY {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e5.prototype),
          (this.name = 'DeleteBillingKeyError'))
      }
    }
    class e8 extends eX {}
    class e4 extends e8 {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, e4.prototype), (this.name = 'GetCashReceiptsError'))
      }
    }
    class e3 extends e8 {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e3.prototype),
          (this.name = 'IssueCashReceiptError'))
      }
    }
    class e9 extends e8 {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, e9.prototype),
          (this.name = 'CancelCashReceiptError'))
      }
    }
    class e6 extends e8 {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, e6.prototype), (this.name = 'GetCashReceiptError'))
      }
    }
    class te extends eX {}
    class tt extends te {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tt.prototype),
          (this.name = 'GetPaymentScheduleError'))
      }
    }
    class to extends te {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, to.prototype),
          (this.name = 'GetPaymentSchedulesError'))
      }
    }
    class tr extends te {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tr.prototype),
          (this.name = 'RevokePaymentSchedulesError'))
      }
    }
    class tn extends te {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tn.prototype),
          (this.name = 'CreatePaymentScheduleError'))
      }
    }
    class ts extends eX {}
    class ta extends ts {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, ta.prototype), (this.name = 'GetPromotionError'))
      }
    }
    class ti extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, ti.prototype),
          (this.name = 'GetAllPaymentEventsError'))
      }
    }
    class tc extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tc.prototype), (this.name = 'GetAllPaymentsError'))
      }
    }
    class th extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, th.prototype),
          (this.name = 'PayWithBillingKeyError'))
      }
    }
    class tl extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tl.prototype), (this.name = 'CancelPaymentError'))
      }
    }
    class tp extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tp.prototype), (this.name = 'ConfirmPaymentError'))
      }
    }
    class td extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, td.prototype), (this.name = 'ConfirmEscrowError'))
      }
    }
    class tf extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tf.prototype),
          (this.name = 'ApplyEscrowLogisticsError'))
      }
    }
    class tu extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tu.prototype),
          (this.name = 'ModifyEscrowLogisticsError'))
      }
    }
    class ty extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, ty.prototype), (this.name = 'PayInstantlyError'))
      }
    }
    class tm extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tm.prototype),
          (this.name = 'PreRegisterPaymentError'))
      }
    }
    class tw extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tw.prototype),
          (this.name = 'RegisterStoreReceiptError'))
      }
    }
    class tP extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tP.prototype), (this.name = 'ResendWebhookError'))
      }
    }
    class tO extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tO.prototype),
          (this.name = 'GetPaymentTransactionsError'))
      }
    }
    class tj extends eX {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tj.prototype),
          (this.name = 'CloseVirtualAccountError'))
      }
    }
    class tU extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tU.prototype), (this.name = 'GetPaymentError'))
      }
    }
    class t$ extends eX {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, t$.prototype), (this.name = 'GetPaymentsError'))
      }
    }
    class tb extends o {}
    class tg extends tb {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tg.prototype),
          (this.name = 'ConfirmIdentityVerificationError'))
      }
    }
    class tA extends tb {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tA.prototype),
          (this.name = 'ResendIdentityVerificationError'))
      }
    }
    class tR extends tb {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tR.prototype),
          (this.name = 'SendIdentityVerificationError'))
      }
    }
    class tI extends tb {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tI.prototype),
          (this.name = 'GetIdentityVerificationError'))
      }
    }
    class tx extends tb {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tx.prototype),
          (this.name = 'GetIdentityVerificationsError'))
      }
    }
    class tE extends o {}
    class tT extends tE {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tT.prototype),
          (this.name = 'GetKakaopayPaymentOrderError'))
      }
    }
    class tS extends o {}
    class tC extends tS {
      constructor(e) {
        ;(super(e),
          Object.setPrototypeOf(this, tC.prototype),
          (this.name = 'LoginViaApiSecretError'))
      }
    }
    class tk extends tS {
      constructor(e) {
        ;(super(e), Object.setPrototypeOf(this, tk.prototype), (this.name = 'RefreshTokenError'))
      }
    }
    let tL = (function (e) {
      let t,
        o,
        r,
        n,
        x,
        E,
        C,
        L,
        Z,
        et,
        er,
        es,
        ei,
        eO,
        eU,
        eX,
        eY,
        e8,
        te,
        ts,
        tb,
        tE,
        tS,
        tL,
        tz,
        tv,
        tB,
        tG,
        tN,
        tJ,
        tM,
        tD,
        tF,
        tq,
        tK,
        tV,
        tH,
        tW,
        t_,
        tQ
      return {
        b2b: {
          taxInvoice:
            ((t = e.baseUrl ?? 'https://api.portone.io'),
            (o = e.secret),
            {
              getB2bBulkTaxInvoice: async (e) => {
                let { bulkTaxInvoiceId: r, test: n } = e,
                  i = [['test', n]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  c = await fetch(
                    new URL(`/b2b/bulk-tax-invoices/${encodeURIComponent(r)}?${i}`, t),
                    { method: 'GET', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!c.ok) throw new a(await c.json())
                return c.json()
              },
              createB2bFileUploadUrl: async (e) => {
                let { test: r, fileName: n } = e,
                  a = JSON.stringify({ fileName: n }),
                  c = [['test', r]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(new URL(`/b2b/file-upload-url?${c}`, t), {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    body: a,
                  })
                if (!h.ok) throw new i(await h.json())
                return h.json()
              },
              downloadB2bTaxInvoicesSheet: async (e) => {
                let r = e?.filter,
                  n = [
                    [
                      'requestBody',
                      JSON.stringify({ filter: r, fields: e?.fields, test: e?.test }),
                    ],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  a = await fetch(new URL(`/b2b/tax-invoices-sheet?${n}`, t), {
                    method: 'GET',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                  })
                if (!a.ok) throw new c(await a.json())
                return a.text()
              },
              updateB2bTaxInvoiceDraft: async (e) => {
                let {
                    test: r,
                    brn: n,
                    taxInvoiceKey: a,
                    taxInvoiceKeyType: i,
                    taxInvoice: c,
                    memo: l,
                  } = e,
                  p = JSON.stringify({
                    brn: n,
                    taxInvoiceKey: a,
                    taxInvoiceKeyType: i,
                    taxInvoice: c,
                    memo: l,
                  }),
                  d = [['test', r]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  f = await fetch(new URL(`/b2b/tax-invoices/draft?${d}`, t), {
                    method: 'PUT',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    body: p,
                  })
                if (!f.ok) throw new h(await f.json())
                return f.json()
              },
              draftB2bTaxInvoice: async (e) => {
                let { test: r, taxInvoice: n, modification: a, memo: i } = e,
                  c = JSON.stringify({ taxInvoice: n, modification: a, memo: i }),
                  h = [['test', r]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  p = await fetch(new URL(`/b2b/tax-invoices/draft?${h}`, t), {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    body: c,
                  })
                if (!p.ok) throw new l(await p.json())
                return p.json()
              },
              issueB2bTaxInvoiceImmediately: async (e) => {
                let { test: r, taxInvoice: n, memo: a, modification: i } = e,
                  c = JSON.stringify({ taxInvoice: n, memo: a, modification: i }),
                  h = [['test', r]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  l = await fetch(new URL(`/b2b/tax-invoices/issue-immediately?${h}`, t), {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    body: c,
                  })
                if (!l.ok) throw new p(await l.json())
                return l.json()
              },
              requestB2bTaxInvoiceReverseIssuance: async (e) => {
                let { test: r, taxInvoice: n, memo: a, modification: i } = e,
                  c = JSON.stringify({ taxInvoice: n, memo: a, modification: i }),
                  h = [['test', r]]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  l = await fetch(new URL(`/b2b/tax-invoices/request-reverse-issuance?${h}`, t), {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    body: c,
                  })
                if (!l.ok) throw new d(await l.json())
                return l.json()
              },
              attachB2bTaxInvoiceFile: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i, fileId: c } = e,
                  h = JSON.stringify({ fileId: c }),
                  l = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  p = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/attach-file?${l}`, t),
                    {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                      body: h,
                    }
                  )
                if (!p.ok) throw new f(await p.json())
              },
              deleteB2bTaxInvoiceAttachment: async (e) => {
                let {
                    taxInvoiceKey: r,
                    attachmentId: n,
                    brn: a,
                    taxInvoiceKeyType: i,
                    test: c,
                  } = e,
                  h = [
                    ['brn', a],
                    ['taxInvoiceKeyType', i],
                    ['test', c],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  l = await fetch(
                    new URL(
                      `/b2b/tax-invoices/${encodeURIComponent(r)}/attachments/${encodeURIComponent(n)}?${h}`,
                      t
                    ),
                    {
                      method: 'DELETE',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                    }
                  )
                if (!l.ok) throw new u(await l.json())
              },
              getB2bTaxInvoiceAttachments: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/attachments?${c}`, t),
                    { method: 'GET', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!h.ok) throw new y(await h.json())
                return h.json()
              },
              cancelB2bTaxInvoiceIssuance: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i, memo: c } = e,
                  h = JSON.stringify({ memo: c }),
                  l = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  p = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/cancel-issuance?${l}`, t),
                    {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                      body: h,
                    }
                  )
                if (!p.ok) throw new m(await p.json())
                return p.json()
              },
              cancelB2bTaxInvoiceRequest: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i, memo: c } = e,
                  h = JSON.stringify({ memo: c }),
                  l = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  p = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/cancel-request?${l}`, t),
                    {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                      body: h,
                    }
                  )
                if (!p.ok) throw new w(await p.json())
                return p.json()
              },
              issueB2bTaxInvoice: async (e) => {
                let {
                    taxInvoiceKey: r,
                    brn: n,
                    taxInvoiceKeyType: a,
                    test: i,
                    memo: c,
                    emailSubject: h,
                  } = e,
                  l = JSON.stringify({ memo: c, emailSubject: h }),
                  p = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  d = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/issue?${p}`, t),
                    {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                      body: l,
                    }
                  )
                if (!d.ok) throw new P(await d.json())
                return d.json()
              },
              getB2bTaxInvoicePdfDownloadUrl: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/pdf-download-url?${c}`, t),
                    { method: 'GET', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!h.ok) throw new O(await h.json())
                return h.json()
              },
              getB2bTaxInvoicePopupUrl: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, includeMenu: i, test: c } = e,
                  h = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['includeMenu', i],
                    ['test', c],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  l = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/popup-url?${h}`, t),
                    { method: 'GET', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!l.ok) throw new j(await l.json())
                return l.json()
              },
              getB2bTaxInvoicePrintUrl: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/print-url?${c}`, t),
                    { method: 'GET', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!h.ok) throw new U(await h.json())
                return h.json()
              },
              refuseB2bTaxInvoiceRequest: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i, memo: c } = e,
                  h = JSON.stringify({ memo: c }),
                  l = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  p = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/refuse-request?${l}`, t),
                    {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                      body: h,
                    }
                  )
                if (!p.ok) throw new $(await p.json())
                return p.json()
              },
              requestB2bTaxInvoice: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/request?${c}`, t),
                    { method: 'POST', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!h.ok) throw new b(await h.json())
                return h.json()
              },
              sendToNtsB2bTaxInvoice: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(
                    new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}/send-to-nts?${c}`, t),
                    { method: 'POST', headers: { Authorization: `PortOne ${o}`, 'User-Agent': s } }
                  )
                if (!h.ok) throw new g(await h.json())
                return h.json()
              },
              getB2bTaxInvoice: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}?${c}`, t), {
                    method: 'GET',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                  })
                if (!h.ok) throw new A(await h.json())
                return h.json()
              },
              deleteB2bTaxInvoice: async (e) => {
                let { taxInvoiceKey: r, brn: n, taxInvoiceKeyType: a, test: i } = e,
                  c = [
                    ['brn', n],
                    ['taxInvoiceKeyType', a],
                    ['test', i],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  h = await fetch(new URL(`/b2b/tax-invoices/${encodeURIComponent(r)}?${c}`, t), {
                    method: 'DELETE',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                  })
                if (!h.ok) throw new R(await h.json())
                return h.json()
              },
              getB2bTaxInvoices: async (e) => {
                let r = e?.test,
                  n = e?.pageNumber,
                  a = [
                    [
                      'requestBody',
                      JSON.stringify({
                        test: r,
                        pageNumber: n,
                        pageSize: e?.pageSize,
                        filter: e?.filter,
                      }),
                    ],
                  ]
                    .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                    .join('&'),
                  i = await fetch(new URL(`/b2b/tax-invoices?${a}`, t), {
                    method: 'GET',
                    headers: { Authorization: `PortOne ${o}`, 'User-Agent': s },
                  })
                if (!i.ok) throw new I(await i.json())
                return i.json()
              },
            }),
        },
        platform:
          ((r = e.baseUrl ?? 'https://api.portone.io'),
          (n = e.secret),
          {
            getPlatform: async (e) => {
              let t = await fetch(new URL('/platform', r), {
                method: 'GET',
                headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
              })
              if (!t.ok) throw new eE(await t.json())
              return t.json()
            },
            getPlatformAdditionalFeePolicySchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'GET', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eT(await o.json())
              return o.json()
            },
            rescheduleAdditionalFeePolicy: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'PUT',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eS(await c.json())
              return c.json()
            },
            scheduleAdditionalFeePolicy: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eC(await c.json())
              return c.json()
            },
            cancelPlatformAdditionalFeePolicySchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'DELETE', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new ek(await o.json())
              return o.json()
            },
            getPlatformContractSchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/contracts/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'GET', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eL(await o.json())
              return o.json()
            },
            rescheduleContract: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/contracts/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'PUT',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new ez(await c.json())
              return c.json()
            },
            scheduleContract: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/contracts/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new ev(await c.json())
              return c.json()
            },
            cancelPlatformContractSchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/contracts/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'DELETE', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eB(await o.json())
              return o.json()
            },
            getPlatformDiscountSharePolicySchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'GET', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eG(await o.json())
              return o.json()
            },
            rescheduleDiscountSharePolicy: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'PUT',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eN(await c.json())
              return c.json()
            },
            scheduleDiscountSharePolicy: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eJ(await c.json())
              return c.json()
            },
            cancelPlatformDiscountSharePolicySchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'DELETE', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eM(await o.json())
              return o.json()
            },
            getPlatformDiscountSharePolicyFilterOptions: async (e) => {
              let t = [['isArchived', e?.isArchived]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                o = await fetch(new URL(`/platform/discount-share-policy-filter-options?${t}`, r), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                })
              if (!o.ok) throw new eD(await o.json())
              return o.json()
            },
            getPlatformPartnerFilterOptions: async (e) => {
              let t = [['isArchived', e?.isArchived]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                o = await fetch(new URL(`/platform/partner-filter-options?${t}`, r), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                })
              if (!o.ok) throw new eF(await o.json())
              return o.json()
            },
            schedulePlatformPartners: async (e) => {
              let { filter: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ filter: t, update: o, appliedAt: a }),
                c = await fetch(new URL('/platform/partners/schedule', r), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                  body: i,
                })
              if (!c.ok) throw new eq(await c.json())
              return c.json()
            },
            getPlatformPartnerSchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/partners/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'GET', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eK(await o.json())
              return o.json()
            },
            reschedulePartner: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/partners/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'PUT',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eV(await c.json())
              return c.json()
            },
            schedulePartner: async (e) => {
              let { id: t, update: o, appliedAt: a } = e,
                i = JSON.stringify({ update: o, appliedAt: a }),
                c = await fetch(
                  new URL(`/platform/partners/${encodeURIComponent(t)}/schedule`, r),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                    body: i,
                  }
                )
              if (!c.ok) throw new eH(await c.json())
              return c.json()
            },
            cancelPlatformPartnerSchedule: async (e) => {
              let { id: t } = e,
                o = await fetch(
                  new URL(`/platform/partners/${encodeURIComponent(t)}/schedule`, r),
                  { method: 'DELETE', headers: { Authorization: `PortOne ${n}`, 'User-Agent': s } }
                )
              if (!o.ok) throw new eW(await o.json())
              return o.json()
            },
            getPlatformSetting: async (e) => {
              let t = await fetch(new URL('/platform/setting', r), {
                method: 'GET',
                headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
              })
              if (!t.ok) throw new e_(await t.json())
              return t.json()
            },
            updatePlatformSetting: async (e) => {
              let t = e?.defaultWithdrawalMemo,
                o = e?.defaultDepositMemo,
                a = e?.supportsMultipleOrderTransfersPerPartner,
                i = e?.adjustSettlementDateAfterHolidayIfEarlier,
                c = JSON.stringify({
                  defaultWithdrawalMemo: t,
                  defaultDepositMemo: o,
                  supportsMultipleOrderTransfersPerPartner: a,
                  adjustSettlementDateAfterHolidayIfEarlier: i,
                  deductWht: e?.deductWht,
                  settlementAmountType: e?.settlementAmountType,
                }),
                h = await fetch(new URL('/platform/setting', r), {
                  method: 'PATCH',
                  headers: { Authorization: `PortOne ${n}`, 'User-Agent': s },
                  body: c,
                })
              if (!h.ok) throw new eQ(await h.json())
              return h.json()
            },
            company:
              ((x = e.baseUrl ?? 'https://api.portone.io'),
              (E = e.secret),
              {
                getB2bBusinessInfos: async (e) => {
                  let { brnList: t } = e,
                    o = JSON.stringify({ brnList: t }),
                    r = await fetch(new URL('/b2b/companies/business-info', x), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${E}`, 'User-Agent': s },
                      body: o,
                    })
                  if (!r.ok) throw new T(await r.json())
                  return r.json()
                },
                getPlatformCompanyState: async (e) => {
                  let { businessRegistrationNumber: t } = e,
                    o = await fetch(
                      new URL(`/platform/companies/${encodeURIComponent(t)}/state`, x),
                      { method: 'GET', headers: { Authorization: `PortOne ${E}`, 'User-Agent': s } }
                    )
                  if (!o.ok) throw new S(await o.json())
                  return o.json()
                },
              }),
            accountTransfer:
              ((C = e.baseUrl ?? 'https://api.portone.io'),
              (L = e.secret),
              {
                getPlatformAccountTransfers: async (e) => {
                  let t = e?.isForTest,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ isForTest: t, page: e?.page, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/platform/account-transfers?${o}`, C), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${L}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new k(await r.json())
                  return r.json()
                },
              }),
            policy:
              ((Z = e.baseUrl ?? 'https://api.portone.io'),
              (et = e.secret),
              {
                getPlatformAdditionalFeePolicies: async (e) => {
                  let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/additional-fee-policies?${t}`, Z), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new z(await o.json())
                  return o.json()
                },
                createPlatformAdditionalFeePolicy: async (e) => {
                  let { id: t, name: o, fee: r, memo: n, vatPayer: a } = e,
                    i = JSON.stringify({ id: t, name: o, fee: r, memo: n, vatPayer: a }),
                    c = await fetch(new URL('/platform/additional-fee-policies', Z), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      body: i,
                    })
                  if (!c.ok) throw new v(await c.json())
                  return c.json()
                },
                getPlatformAdditionalFeePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}`, Z),
                      {
                        method: 'GET',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new B(await o.json())
                  return o.json()
                },
                updatePlatformAdditionalFeePolicy: async (e) => {
                  let { id: t, fee: o, name: r, memo: n, vatPayer: a } = e,
                    i = JSON.stringify({ fee: o, name: r, memo: n, vatPayer: a }),
                    c = await fetch(
                      new URL(`/platform/additional-fee-policies/${encodeURIComponent(t)}`, Z),
                      {
                        method: 'PATCH',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                        body: i,
                      }
                    )
                  if (!c.ok) throw new G(await c.json())
                  return c.json()
                },
                archivePlatformAdditionalFeePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/additional-fee-policies/${encodeURIComponent(t)}/archive`,
                        Z
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new N(await o.json())
                  return o.json()
                },
                recoverPlatformAdditionalFeePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/additional-fee-policies/${encodeURIComponent(t)}/recover`,
                        Z
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new J(await o.json())
                  return o.json()
                },
                getPlatformContracts: async (e) => {
                  let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/contracts?${t}`, Z), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new M(await o.json())
                  return o.json()
                },
                createPlatformContract: async (e) => {
                  let {
                      id: t,
                      name: o,
                      memo: r,
                      platformFee: n,
                      settlementCycle: a,
                      platformFeeVatPayer: i,
                      subtractPaymentVatAmount: c,
                    } = e,
                    h = JSON.stringify({
                      id: t,
                      name: o,
                      memo: r,
                      platformFee: n,
                      settlementCycle: a,
                      platformFeeVatPayer: i,
                      subtractPaymentVatAmount: c,
                    }),
                    l = await fetch(new URL('/platform/contracts', Z), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      body: h,
                    })
                  if (!l.ok) throw new D(await l.json())
                  return l.json()
                },
                getPlatformContract: async (e) => {
                  let { id: t } = e,
                    o = await fetch(new URL(`/platform/contracts/${encodeURIComponent(t)}`, Z), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new F(await o.json())
                  return o.json()
                },
                updatePlatformContract: async (e) => {
                  let {
                      id: t,
                      name: o,
                      memo: r,
                      platformFee: n,
                      settlementCycle: a,
                      platformFeeVatPayer: i,
                      subtractPaymentVatAmount: c,
                    } = e,
                    h = JSON.stringify({
                      name: o,
                      memo: r,
                      platformFee: n,
                      settlementCycle: a,
                      platformFeeVatPayer: i,
                      subtractPaymentVatAmount: c,
                    }),
                    l = await fetch(new URL(`/platform/contracts/${encodeURIComponent(t)}`, Z), {
                      method: 'PATCH',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      body: h,
                    })
                  if (!l.ok) throw new q(await l.json())
                  return l.json()
                },
                archivePlatformContract: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/contracts/${encodeURIComponent(t)}/archive`, Z),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new K(await o.json())
                  return o.json()
                },
                recoverPlatformContract: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/contracts/${encodeURIComponent(t)}/recover`, Z),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new V(await o.json())
                  return o.json()
                },
                getPlatformDiscountSharePolicies: async (e) => {
                  let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/discount-share-policies?${t}`, Z), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new H(await o.json())
                  return o.json()
                },
                createPlatformDiscountSharePolicy: async (e) => {
                  let { id: t, name: o, partnerShareRate: r, memo: n } = e,
                    a = JSON.stringify({ id: t, name: o, partnerShareRate: r, memo: n }),
                    i = await fetch(new URL('/platform/discount-share-policies', Z), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      body: a,
                    })
                  if (!i.ok) throw new W(await i.json())
                  return i.json()
                },
                getPlatformDiscountSharePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}`, Z),
                      {
                        method: 'GET',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new _(await o.json())
                  return o.json()
                },
                updatePlatformDiscountSharePolicy: async (e) => {
                  let { id: t, name: o, partnerShareRate: r, memo: n } = e,
                    a = JSON.stringify({ name: o, partnerShareRate: r, memo: n }),
                    i = await fetch(
                      new URL(`/platform/discount-share-policies/${encodeURIComponent(t)}`, Z),
                      {
                        method: 'PATCH',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                        body: a,
                      }
                    )
                  if (!i.ok) throw new Q(await i.json())
                  return i.json()
                },
                archivePlatformDiscountSharePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/discount-share-policies/${encodeURIComponent(t)}/archive`,
                        Z
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new X(await o.json())
                  return o.json()
                },
                recoverPlatformDiscountSharePolicy: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/discount-share-policies/${encodeURIComponent(t)}/recover`,
                        Z
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${et}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new Y(await o.json())
                  return o.json()
                },
              }),
            account:
              ((er = e.baseUrl ?? 'https://api.portone.io'),
              (es = e.secret),
              {
                getPlatformAccountHolder: async (e) => {
                  let {
                      bank: t,
                      accountNumber: o,
                      birthdate: r,
                      businessRegistrationNumber: n,
                    } = e,
                    a = [
                      ['birthdate', r],
                      ['businessRegistrationNumber', n],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    i = await fetch(
                      new URL(
                        `/platform/bank-accounts/${encodeURIComponent(t)}/${encodeURIComponent(o)}/holder?${a}`,
                        er
                      ),
                      {
                        method: 'GET',
                        headers: { Authorization: `PortOne ${es}`, 'User-Agent': s },
                      }
                    )
                  if (!i.ok) throw new ee(await i.json())
                  return i.json()
                },
              }),
            bulkAccountTransfer:
              ((ei = e.baseUrl ?? 'https://api.portone.io'),
              (eO = e.secret),
              {
                getPlatformBulkAccountTransfers: async (e) => {
                  let t = e?.isForTest,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ isForTest: t, page: e?.page, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/platform/bulk-account-transfers?${o}`, ei), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${eO}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new eo(await r.json())
                  return r.json()
                },
              }),
            bulkPayout:
              ((eU = e.baseUrl ?? 'https://api.portone.io'),
              (eX = e.secret),
              {
                getPlatformBulkPayouts: async (e) => {
                  let t = e?.isForTest,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ isForTest: t, page: e?.page, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/platform/bulk-payouts?${o}`, eU), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${eX}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new en(await r.json())
                  return r.json()
                },
              }),
            partnerSettlement:
              ((eY = e.baseUrl ?? 'https://api.portone.io'),
              (e8 = e.secret),
              {
                getPlatformPartnerSettlements: async (e) => {
                  let { page: t, filter: o, isForTest: r } = e,
                    n = [['requestBody', JSON.stringify({ page: t, filter: o, isForTest: r })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    a = await fetch(new URL(`/platform/partner-settlements?${n}`, eY), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${e8}`, 'User-Agent': s },
                    })
                  if (!a.ok) throw new ea(await a.json())
                  return a.json()
                },
              }),
            partner:
              ((te = e.baseUrl ?? 'https://api.portone.io'),
              (ts = e.secret),
              {
                getPlatformPartners: async (e) => {
                  let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/partners?${t}`, te), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new ec(await o.json())
                  return o.json()
                },
                createPlatformPartner: async (e) => {
                  let {
                      id: t,
                      name: o,
                      contact: r,
                      account: n,
                      defaultContractId: a,
                      memo: i,
                      tags: c,
                      type: h,
                      userDefinedProperties: l,
                    } = e,
                    p = JSON.stringify({
                      id: t,
                      name: o,
                      contact: r,
                      account: n,
                      defaultContractId: a,
                      memo: i,
                      tags: c,
                      type: h,
                      userDefinedProperties: l,
                    }),
                    d = await fetch(new URL('/platform/partners', te), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      body: p,
                    })
                  if (!d.ok) throw new eh(await d.json())
                  return d.json()
                },
                createPlatformPartners: async (e) => {
                  let { partners: t } = e,
                    o = JSON.stringify({ partners: t }),
                    r = await fetch(new URL('/platform/partners/batch', te), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      body: o,
                    })
                  if (!r.ok) throw new el(await r.json())
                  return r.json()
                },
                connectBulkPartnerMemberCompany: async (e) => {
                  let t = JSON.stringify({ filter: e?.filter }),
                    o = await fetch(new URL('/platform/partners/member-company-connect', te), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      body: t,
                    })
                  if (!o.ok) throw new ep(await o.json())
                  return o.json()
                },
                connectPartnerMemberCompany: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/partners/member-company-connect/${encodeURIComponent(t)}`,
                        te
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new ed(await o.json())
                  return o.json()
                },
                disconnectBulkPartnerMemberCompany: async (e) => {
                  let t = JSON.stringify({ filter: e?.filter }),
                    o = await fetch(new URL('/platform/partners/member-company-disconnect', te), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      body: t,
                    })
                  if (!o.ok) throw new ef(await o.json())
                  return o.json()
                },
                disconnectPartnerMemberCompany: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(
                        `/platform/partners/member-company-disconnect/${encodeURIComponent(t)}`,
                        te
                      ),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new eu(await o.json())
                  return o.json()
                },
                getPlatformPartner: async (e) => {
                  let { id: t } = e,
                    o = await fetch(new URL(`/platform/partners/${encodeURIComponent(t)}`, te), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new ey(await o.json())
                  return o.json()
                },
                updatePlatformPartner: async (e) => {
                  let {
                      id: t,
                      name: o,
                      contact: r,
                      account: n,
                      defaultContractId: a,
                      memo: i,
                      tags: c,
                      type: h,
                      userDefinedProperties: l,
                    } = e,
                    p = JSON.stringify({
                      name: o,
                      contact: r,
                      account: n,
                      defaultContractId: a,
                      memo: i,
                      tags: c,
                      type: h,
                      userDefinedProperties: l,
                    }),
                    d = await fetch(new URL(`/platform/partners/${encodeURIComponent(t)}`, te), {
                      method: 'PATCH',
                      headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      body: p,
                    })
                  if (!d.ok) throw new em(await d.json())
                  return d.json()
                },
                archivePlatformPartner: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/partners/${encodeURIComponent(t)}/archive`, te),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new ew(await o.json())
                  return o.json()
                },
                recoverPlatformPartner: async (e) => {
                  let { id: t } = e,
                    o = await fetch(
                      new URL(`/platform/partners/${encodeURIComponent(t)}/recover`, te),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${ts}`, 'User-Agent': s },
                      }
                    )
                  if (!o.ok) throw new eP(await o.json())
                  return o.json()
                },
              }),
            payout:
              ((tb = e.baseUrl ?? 'https://api.portone.io'),
              (tE = e.secret),
              {
                getPlatformPayouts: async (e) => {
                  let t = e?.isForTest,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ isForTest: t, page: e?.page, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/platform/payouts?${o}`, tb), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tE}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new ej(await r.json())
                  return r.json()
                },
              }),
            transfer:
              ((tS = e.baseUrl ?? 'https://api.portone.io'),
              (tL = e.secret),
              {
                downloadPlatformTransferSheet: async (e) => {
                  let t = [
                      ['requestBody', JSON.stringify({ filter: e?.filter, fields: e?.fields })],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/transfer-summaries/sheet-file?${t}`, tS), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new e$(await o.json())
                  return o.text()
                },
                getPlatformTransferSummaries: async (e) => {
                  let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    o = await fetch(new URL(`/platform/transfer-summaries?${t}`, tS), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new eb(await o.json())
                  return o.json()
                },
                createPlatformManualTransfer: async (e) => {
                  let {
                      partnerId: t,
                      memo: o,
                      settlementAmount: r,
                      settlementTaxFreeAmount: n,
                      settlementDate: a,
                      isForTest: i,
                      userDefinedProperties: c,
                    } = e,
                    h = JSON.stringify({
                      partnerId: t,
                      memo: o,
                      settlementAmount: r,
                      settlementTaxFreeAmount: n,
                      settlementDate: a,
                      isForTest: i,
                      userDefinedProperties: c,
                    }),
                    l = await fetch(new URL('/platform/transfers/manual', tS), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                      body: h,
                    })
                  if (!l.ok) throw new eg(await l.json())
                  return l.json()
                },
                createPlatformOrderTransfer: async (e) => {
                  let {
                      partnerId: t,
                      contractId: o,
                      memo: r,
                      paymentId: n,
                      orderDetail: a,
                      taxFreeAmount: i,
                      settlementStartDate: c,
                      settlementDate: h,
                      discounts: l,
                      additionalFees: p,
                      externalPaymentDetail: d,
                      isForTest: f,
                      parameters: u,
                      userDefinedProperties: y,
                    } = e,
                    m = JSON.stringify({
                      partnerId: t,
                      contractId: o,
                      memo: r,
                      paymentId: n,
                      orderDetail: a,
                      taxFreeAmount: i,
                      settlementStartDate: c,
                      settlementDate: h,
                      discounts: l,
                      additionalFees: p,
                      externalPaymentDetail: d,
                      isForTest: f,
                      parameters: u,
                      userDefinedProperties: y,
                    }),
                    w = await fetch(new URL('/platform/transfers/order', tS), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                      body: m,
                    })
                  if (!w.ok) throw new eA(await w.json())
                  return w.json()
                },
                createPlatformOrderCancelTransfer: async (e) => {
                  let {
                      partnerId: t,
                      paymentId: o,
                      transferId: r,
                      cancellationId: n,
                      memo: a,
                      orderDetail: i,
                      taxFreeAmount: c,
                      discounts: h,
                      settlementStartDate: l,
                      settlementDate: p,
                      externalCancellationDetail: d,
                      isForTest: f,
                      userDefinedProperties: u,
                    } = e,
                    y = JSON.stringify({
                      partnerId: t,
                      paymentId: o,
                      transferId: r,
                      cancellationId: n,
                      memo: a,
                      orderDetail: i,
                      taxFreeAmount: c,
                      discounts: h,
                      settlementStartDate: l,
                      settlementDate: p,
                      externalCancellationDetail: d,
                      isForTest: f,
                      userDefinedProperties: u,
                    }),
                    m = await fetch(new URL('/platform/transfers/order-cancel', tS), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                      body: y,
                    })
                  if (!m.ok) throw new eR(await m.json())
                  return m.json()
                },
                getPlatformTransfer: async (e) => {
                  let { id: t } = e,
                    o = await fetch(new URL(`/platform/transfers/${encodeURIComponent(t)}`, tS), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new eI(await o.json())
                  return o.json()
                },
                deletePlatformTransfer: async (e) => {
                  let { id: t } = e,
                    o = await fetch(new URL(`/platform/transfers/${encodeURIComponent(t)}`, tS), {
                      method: 'DELETE',
                      headers: { Authorization: `PortOne ${tL}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new ex(await o.json())
                  return o.json()
                },
              }),
          }),
        payment:
          ((tz = e.baseUrl ?? 'https://api.portone.io'),
          (tv = e.secret),
          {
            getAllPaymentEventsByCursor: async (t) => {
              let o = t?.storeId,
                r = t?.from,
                n = t?.until,
                a = t?.cursor,
                i = t?.size,
                c = [
                  [
                    'requestBody',
                    JSON.stringify({
                      storeId: o ?? e.storeId,
                      from: r,
                      until: n,
                      cursor: a,
                      size: i,
                    }),
                  ],
                ]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                h = await fetch(new URL(`/payment-events-by-cursor?${c}`, tz), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                })
              if (!h.ok) throw new ti(await h.json())
              return h.json()
            },
            getAllPaymentsByCursor: async (t) => {
              let o = t?.storeId,
                r = t?.from,
                n = t?.until,
                a = t?.cursor,
                i = t?.size,
                c = [
                  [
                    'requestBody',
                    JSON.stringify({
                      storeId: o ?? e.storeId,
                      from: r,
                      until: n,
                      cursor: a,
                      size: i,
                    }),
                  ],
                ]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                h = await fetch(new URL(`/payments-by-cursor?${c}`, tz), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                })
              if (!h.ok) throw new tc(await h.json())
              return h.json()
            },
            payWithBillingKey: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  billingKey: n,
                  channelKey: a,
                  orderName: i,
                  customer: c,
                  customData: h,
                  amount: l,
                  currency: p,
                  installmentMonth: d,
                  useFreeInterestFromMerchant: f,
                  useCardPoint: u,
                  cashReceipt: y,
                  country: m,
                  noticeUrls: w,
                  products: P,
                  productCount: O,
                  productType: j,
                  shippingAddress: U,
                  promotionId: $,
                  locale: b,
                  bypass: g,
                } = t,
                A = JSON.stringify({
                  storeId: r ?? e.storeId,
                  billingKey: n,
                  channelKey: a,
                  orderName: i,
                  customer: c,
                  customData: h,
                  amount: l,
                  currency: p,
                  installmentMonth: d,
                  useFreeInterestFromMerchant: f,
                  useCardPoint: u,
                  cashReceipt: y,
                  country: m,
                  noticeUrls: w,
                  products: P,
                  productCount: O,
                  productType: j,
                  shippingAddress: U,
                  promotionId: $,
                  locale: b,
                  bypass: g,
                }),
                R = await fetch(new URL(`/payments/${encodeURIComponent(o)}/billing-key`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: A,
                })
              if (!R.ok) throw new th(await R.json())
              return R.json()
            },
            cancelPayment: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  amount: n,
                  taxFreeAmount: a,
                  vatAmount: i,
                  reason: c,
                  requester: h,
                  promotionDiscountRetainOption: l,
                  currentCancellableAmount: p,
                  refundAccount: d,
                } = t,
                f = JSON.stringify({
                  storeId: r ?? e.storeId,
                  amount: n,
                  taxFreeAmount: a,
                  vatAmount: i,
                  reason: c,
                  requester: h,
                  promotionDiscountRetainOption: l,
                  currentCancellableAmount: p,
                  refundAccount: d,
                }),
                u = await fetch(new URL(`/payments/${encodeURIComponent(o)}/cancel`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: f,
                })
              if (!u.ok) throw new tl(await u.json())
              return u.json()
            },
            confirmPayment: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  paymentToken: n,
                  txId: a,
                  currency: i,
                  totalAmount: c,
                  taxFreeAmount: h,
                  isTest: l,
                } = t,
                p = JSON.stringify({
                  storeId: r ?? e.storeId,
                  paymentToken: n,
                  txId: a,
                  currency: i,
                  totalAmount: c,
                  taxFreeAmount: h,
                  isTest: l,
                }),
                d = await fetch(new URL(`/payments/${encodeURIComponent(o)}/confirm`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: p,
                })
              if (!d.ok) throw new tp(await d.json())
              return d.json()
            },
            confirmEscrow: async (t) => {
              let { paymentId: o, storeId: r, fromStore: n } = t,
                a = JSON.stringify({ storeId: r ?? e.storeId, fromStore: n }),
                i = await fetch(new URL(`/payments/${encodeURIComponent(o)}/escrow/complete`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: a,
                })
              if (!i.ok) throw new td(await i.json())
              return i.json()
            },
            applyEscrowLogistics: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  sender: n,
                  receiver: a,
                  logistics: i,
                  sendEmail: c,
                  products: h,
                } = t,
                l = JSON.stringify({
                  storeId: r ?? e.storeId,
                  sender: n,
                  receiver: a,
                  logistics: i,
                  sendEmail: c,
                  products: h,
                }),
                p = await fetch(
                  new URL(`/payments/${encodeURIComponent(o)}/escrow/logistics`, tz),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                    body: l,
                  }
                )
              if (!p.ok) throw new tf(await p.json())
              return p.json()
            },
            modifyEscrowLogistics: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  sender: n,
                  receiver: a,
                  logistics: i,
                  sendEmail: c,
                  products: h,
                } = t,
                l = JSON.stringify({
                  storeId: r ?? e.storeId,
                  sender: n,
                  receiver: a,
                  logistics: i,
                  sendEmail: c,
                  products: h,
                }),
                p = await fetch(
                  new URL(`/payments/${encodeURIComponent(o)}/escrow/logistics`, tz),
                  {
                    method: 'PATCH',
                    headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                    body: l,
                  }
                )
              if (!p.ok) throw new tu(await p.json())
              return p.json()
            },
            payInstantly: async (t) => {
              let {
                  paymentId: o,
                  storeId: r,
                  channelKey: n,
                  channelGroupId: a,
                  method: i,
                  orderName: c,
                  isCulturalExpense: h,
                  isEscrow: l,
                  customer: p,
                  customData: d,
                  amount: f,
                  currency: u,
                  country: y,
                  noticeUrls: m,
                  products: w,
                  productCount: P,
                  productType: O,
                  shippingAddress: j,
                  promotionId: U,
                } = t,
                $ = JSON.stringify({
                  storeId: r ?? e.storeId,
                  channelKey: n,
                  channelGroupId: a,
                  method: i,
                  orderName: c,
                  isCulturalExpense: h,
                  isEscrow: l,
                  customer: p,
                  customData: d,
                  amount: f,
                  currency: u,
                  country: y,
                  noticeUrls: m,
                  products: w,
                  productCount: P,
                  productType: O,
                  shippingAddress: j,
                  promotionId: U,
                }),
                b = await fetch(new URL(`/payments/${encodeURIComponent(o)}/instant`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: $,
                })
              if (!b.ok) throw new ty(await b.json())
              return b.json()
            },
            preRegisterPayment: async (t) => {
              let { paymentId: o, storeId: r, totalAmount: n, taxFreeAmount: a, currency: i } = t,
                c = JSON.stringify({
                  storeId: r ?? e.storeId,
                  totalAmount: n,
                  taxFreeAmount: a,
                  currency: i,
                }),
                h = await fetch(new URL(`/payments/${encodeURIComponent(o)}/pre-register`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: c,
                })
              if (!h.ok) throw new tm(await h.json())
              return h.json()
            },
            registerStoreReceipt: async (t) => {
              let { paymentId: o, items: r, storeId: n } = t,
                a = JSON.stringify({ items: r, storeId: n ?? e.storeId }),
                i = await fetch(
                  new URL(`/payments/${encodeURIComponent(o)}/register-store-receipt`, tz),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                    body: a,
                  }
                )
              if (!i.ok) throw new tw(await i.json())
              return i.json()
            },
            resendWebhook: async (t) => {
              let { paymentId: o, storeId: r, webhookId: n } = t,
                a = JSON.stringify({ storeId: r ?? e.storeId, webhookId: n }),
                i = await fetch(new URL(`/payments/${encodeURIComponent(o)}/resend-webhook`, tz), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                  body: a,
                })
              if (!i.ok) throw new tP(await i.json())
              return i.json()
            },
            getPaymentTransactions: async (e) => {
              let { paymentId: t, storeId: o } = e,
                r = [['storeId', o]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(
                  new URL(`/payments/${encodeURIComponent(t)}/transactions?${r}`, tz),
                  { method: 'GET', headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s } }
                )
              if (!n.ok) throw new tO(await n.json())
              return n.json()
            },
            closeVirtualAccount: async (e) => {
              let { paymentId: t, storeId: o } = e,
                r = [['storeId', o]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(
                  new URL(`/payments/${encodeURIComponent(t)}/virtual-account/close?${r}`, tz),
                  { method: 'POST', headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s } }
                )
              if (!n.ok) throw new tj(await n.json())
              return n.json()
            },
            getPayment: async (e) => {
              let { paymentId: t, storeId: o } = e,
                r = [['storeId', o]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(new URL(`/payments/${encodeURIComponent(t)}?${r}`, tz), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                })
              if (!n.ok) throw new tU(await n.json())
              return n.json()
            },
            getPayments: async (e) => {
              let t = [['requestBody', JSON.stringify({ page: e?.page, filter: e?.filter })]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                o = await fetch(new URL(`/payments?${t}`, tz), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tv}`, 'User-Agent': s },
                })
              if (!o.ok) throw new t$(await o.json())
              return o.json()
            },
            billingKey:
              ((tB = e.baseUrl ?? 'https://api.portone.io'),
              (tG = e.secret),
              {
                getBillingKeyInfos: async (e) => {
                  let t = e?.page,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ page: t, sort: e?.sort, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/billing-keys?${o}`, tB), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new eZ(await r.json())
                  return r.json()
                },
                issueBillingKey: async (t) => {
                  let {
                      storeId: o,
                      method: r,
                      channelKey: n,
                      channelGroupId: a,
                      customer: i,
                      customData: c,
                      bypass: h,
                      noticeUrls: l,
                    } = t,
                    p = JSON.stringify({
                      storeId: o ?? e.storeId,
                      method: r,
                      channelKey: n,
                      channelGroupId: a,
                      customer: i,
                      customData: c,
                      bypass: h,
                      noticeUrls: l,
                    }),
                    d = await fetch(new URL('/billing-keys', tB), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                      body: p,
                    })
                  if (!d.ok) throw new e2(await d.json())
                  return d.json()
                },
                confirmBillingKey: async (t) => {
                  let { storeId: o, billingIssueToken: r, isTest: n } = t,
                    a = JSON.stringify({
                      storeId: o ?? e.storeId,
                      billingIssueToken: r,
                      isTest: n,
                    }),
                    i = await fetch(new URL('/billing-keys/confirm', tB), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                      body: a,
                    })
                  if (!i.ok) throw new e1(await i.json())
                  return i.json()
                },
                confirmBillingKeyIssueAndPay: async (t) => {
                  let {
                      storeId: o,
                      billingIssueToken: r,
                      paymentId: n,
                      currency: a,
                      totalAmount: i,
                      taxFreeAmount: c,
                      isTest: h,
                    } = t,
                    l = JSON.stringify({
                      storeId: o ?? e.storeId,
                      billingIssueToken: r,
                      paymentId: n,
                      currency: a,
                      totalAmount: i,
                      taxFreeAmount: c,
                      isTest: h,
                    }),
                    p = await fetch(new URL('/billing-keys/confirm-issue-and-pay', tB), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                      body: l,
                    })
                  if (!p.ok) throw new e7(await p.json())
                  return p.json()
                },
                getBillingKeyInfo: async (e) => {
                  let { billingKey: t, storeId: o } = e,
                    r = [['storeId', o]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    n = await fetch(new URL(`/billing-keys/${encodeURIComponent(t)}?${r}`, tB), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                    })
                  if (!n.ok) throw new e0(await n.json())
                  return n.json()
                },
                deleteBillingKey: async (e) => {
                  let { billingKey: t, storeId: o, reason: r, requester: n } = e,
                    a = [
                      ['storeId', o],
                      ['reason', r],
                      ['requester', n],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    i = await fetch(new URL(`/billing-keys/${encodeURIComponent(t)}?${a}`, tB), {
                      method: 'DELETE',
                      headers: { Authorization: `PortOne ${tG}`, 'User-Agent': s },
                    })
                  if (!i.ok) throw new e5(await i.json())
                  return i.json()
                },
              }),
            cashReceipt:
              ((tN = e.baseUrl ?? 'https://api.portone.io'),
              (tJ = e.secret),
              {
                getCashReceipts: async (e) => {
                  let t = e?.page,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ page: t, sort: e?.sort, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/cash-receipts?${o}`, tN), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tJ}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new e4(await r.json())
                  return r.json()
                },
                issueCashReceipt: async (t) => {
                  let {
                      storeId: o,
                      paymentId: r,
                      channelKey: n,
                      type: a,
                      orderName: i,
                      currency: c,
                      amount: h,
                      productType: l,
                      customer: p,
                      paidAt: d,
                      businessRegistrationNumber: f,
                      paymentMethod: u,
                    } = t,
                    y = JSON.stringify({
                      storeId: o ?? e.storeId,
                      paymentId: r,
                      channelKey: n,
                      type: a,
                      orderName: i,
                      currency: c,
                      amount: h,
                      productType: l,
                      customer: p,
                      paidAt: d,
                      businessRegistrationNumber: f,
                      paymentMethod: u,
                    }),
                    m = await fetch(new URL('/cash-receipts', tN), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tJ}`, 'User-Agent': s },
                      body: y,
                    })
                  if (!m.ok) throw new e3(await m.json())
                  return m.json()
                },
                cancelCashReceiptByPaymentId: async (e) => {
                  let { paymentId: t, storeId: o } = e,
                    r = [['storeId', o]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    n = await fetch(
                      new URL(`/payments/${encodeURIComponent(t)}/cash-receipt/cancel?${r}`, tN),
                      {
                        method: 'POST',
                        headers: { Authorization: `PortOne ${tJ}`, 'User-Agent': s },
                      }
                    )
                  if (!n.ok) throw new e9(await n.json())
                  return n.json()
                },
                getCashReceiptByPaymentId: async (e) => {
                  let { paymentId: t, storeId: o } = e,
                    r = [['storeId', o]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    n = await fetch(
                      new URL(`/payments/${encodeURIComponent(t)}/cash-receipt?${r}`, tN),
                      {
                        method: 'GET',
                        headers: { Authorization: `PortOne ${tJ}`, 'User-Agent': s },
                      }
                    )
                  if (!n.ok) throw new e6(await n.json())
                  return n.json()
                },
              }),
            paymentSchedule:
              ((tM = e.baseUrl ?? 'https://api.portone.io'),
              (tD = e.secret),
              {
                getPaymentSchedule: async (e) => {
                  let { paymentScheduleId: t, storeId: o } = e,
                    r = [['storeId', o]]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    n = await fetch(
                      new URL(`/payment-schedules/${encodeURIComponent(t)}?${r}`, tM),
                      {
                        method: 'GET',
                        headers: { Authorization: `PortOne ${tD}`, 'User-Agent': s },
                      }
                    )
                  if (!n.ok) throw new tt(await n.json())
                  return n.json()
                },
                getPaymentSchedules: async (e) => {
                  let t = e?.page,
                    o = [
                      [
                        'requestBody',
                        JSON.stringify({ page: t, sort: e?.sort, filter: e?.filter }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    r = await fetch(new URL(`/payment-schedules?${o}`, tM), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tD}`, 'User-Agent': s },
                    })
                  if (!r.ok) throw new to(await r.json())
                  return r.json()
                },
                revokePaymentSchedules: async (t) => {
                  let o = t?.storeId,
                    r = t?.billingKey,
                    n = t?.scheduleIds,
                    a = [
                      [
                        'requestBody',
                        JSON.stringify({ storeId: o ?? e.storeId, billingKey: r, scheduleIds: n }),
                      ],
                    ]
                      .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                      .join('&'),
                    i = await fetch(new URL(`/payment-schedules?${a}`, tM), {
                      method: 'DELETE',
                      headers: { Authorization: `PortOne ${tD}`, 'User-Agent': s },
                    })
                  if (!i.ok) throw new tr(await i.json())
                  return i.json()
                },
                createPaymentSchedule: async (e) => {
                  let { paymentId: t, payment: o, timeToPay: r } = e,
                    n = JSON.stringify({ payment: o, timeToPay: r }),
                    a = await fetch(new URL(`/payments/${encodeURIComponent(t)}/schedule`, tM), {
                      method: 'POST',
                      headers: { Authorization: `PortOne ${tD}`, 'User-Agent': s },
                      body: n,
                    })
                  if (!a.ok) throw new tn(await a.json())
                  return a.json()
                },
              }),
            promotion:
              ((tF = e.baseUrl ?? 'https://api.portone.io'),
              (tq = e.secret),
              {
                getPromotion: async (e) => {
                  let { promotionId: t } = e,
                    o = await fetch(new URL(`/promotions/${encodeURIComponent(t)}`, tF), {
                      method: 'GET',
                      headers: { Authorization: `PortOne ${tq}`, 'User-Agent': s },
                    })
                  if (!o.ok) throw new ta(await o.json())
                  return o.json()
                },
              }),
          }),
        identityVerification:
          ((tK = e.baseUrl ?? 'https://api.portone.io'),
          (tV = e.secret),
          {
            confirmIdentityVerification: async (t) => {
              let { identityVerificationId: o, storeId: r, otp: n } = t,
                a = JSON.stringify({ storeId: r ?? e.storeId, otp: n }),
                i = await fetch(
                  new URL(`/identity-verifications/${encodeURIComponent(o)}/confirm`, tK),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${tV}`, 'User-Agent': s },
                    body: a,
                  }
                )
              if (!i.ok) throw new tg(await i.json())
              return i.json()
            },
            resendIdentityVerification: async (e) => {
              let { identityVerificationId: t, storeId: o } = e,
                r = [['storeId', o]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(
                  new URL(`/identity-verifications/${encodeURIComponent(t)}/resend?${r}`, tK),
                  { method: 'POST', headers: { Authorization: `PortOne ${tV}`, 'User-Agent': s } }
                )
              if (!n.ok) throw new tA(await n.json())
              return n.json()
            },
            sendIdentityVerification: async (t) => {
              let {
                  identityVerificationId: o,
                  storeId: r,
                  channelKey: n,
                  customer: a,
                  customData: i,
                  bypass: c,
                  operator: h,
                  method: l,
                } = t,
                p = JSON.stringify({
                  storeId: r ?? e.storeId,
                  channelKey: n,
                  customer: a,
                  customData: i,
                  bypass: c,
                  operator: h,
                  method: l,
                }),
                d = await fetch(
                  new URL(`/identity-verifications/${encodeURIComponent(o)}/send`, tK),
                  {
                    method: 'POST',
                    headers: { Authorization: `PortOne ${tV}`, 'User-Agent': s },
                    body: p,
                  }
                )
              if (!d.ok) throw new tR(await d.json())
              return d.json()
            },
            getIdentityVerification: async (e) => {
              let { identityVerificationId: t, storeId: o } = e,
                r = [['storeId', o]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(
                  new URL(`/identity-verifications/${encodeURIComponent(t)}?${r}`, tK),
                  { method: 'GET', headers: { Authorization: `PortOne ${tV}`, 'User-Agent': s } }
                )
              if (!n.ok) throw new tI(await n.json())
              return n.json()
            },
            getIdentityVerifications: async (e) => {
              let t = e?.page,
                o = [['requestBody', JSON.stringify({ page: t, sort: e?.sort, filter: e?.filter })]]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                r = await fetch(new URL(`/identity-verifications?${o}`, tK), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tV}`, 'User-Agent': s },
                })
              if (!r.ok) throw new tx(await r.json())
              return r.json()
            },
          }),
        pgSpecific:
          ((tH = e.baseUrl ?? 'https://api.portone.io'),
          (tW = e.secret),
          {
            getKakaopayPaymentOrder: async (e) => {
              let { pgTxId: t, channelKey: o } = e,
                r = [
                  ['pgTxId', t],
                  ['channelKey', o],
                ]
                  .flatMap(([e, t]) => (null == t ? [] : `${e}=${encodeURIComponent(t)}`))
                  .join('&'),
                n = await fetch(new URL(`/kakaopay/payment/order?${r}`, tH), {
                  method: 'GET',
                  headers: { Authorization: `PortOne ${tW}`, 'User-Agent': s },
                })
              if (!n.ok) throw new tT(await n.json())
              return n.json()
            },
          }),
        auth:
          ((t_ = e.baseUrl ?? 'https://api.portone.io'),
          (tQ = e.secret),
          {
            loginViaApiSecret: async (e) => {
              let { apiSecret: t } = e,
                o = JSON.stringify({ apiSecret: t }),
                r = await fetch(new URL('/login/api-secret', t_), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tQ}`, 'User-Agent': s },
                  body: o,
                })
              if (!r.ok) throw new tC(await r.json())
              return r.json()
            },
            refreshToken: async (e) => {
              let { refreshToken: t } = e,
                o = JSON.stringify({ refreshToken: t }),
                r = await fetch(new URL('/token/refresh', t_), {
                  method: 'POST',
                  headers: { Authorization: `PortOne ${tQ}`, 'User-Agent': s },
                  body: o,
                })
              if (!r.ok) throw new tk(await r.json())
              return r.json()
            },
          }),
      }
    })({ secret: e.i(547499).env.PORTONE_API_SECRET })
    async function tz(e) {
      try {
        return await tL.payment.getPayment({ paymentId: e })
      } catch (e) {
        throw (console.error('[PortOne] Failed to get payment details:', e), e)
      }
    }
    async function tv(e, t) {
      try {
        console.log(`[PortOne] Attempting to cancel payment: ${e}, reason: ${t}`)
        let o = await tL.payment.cancelPayment({ paymentId: e, reason: t })
        return (console.log(`[PortOne] Successfully cancelled payment: ${e}`), o)
      } catch (t) {
        throw (
          console.error('[PortOne] Failed to cancel payment:', {
            paymentId: e,
            error: t,
            errorName: t instanceof Error ? t.name : 'Unknown',
            errorMessage: t instanceof Error ? t.message : String(t),
            errorStack: t instanceof Error ? t.stack : void 0,
            errorDetails: JSON.stringify(t, null, 2),
          }),
          t
        )
      }
    }
    async function tB(e) {
      try {
        let t = await tz(e)
        if (!t) return { success: !1, error: 'Payment not found' }
        let o = 'PAID' === t.status,
          r = 'CANCELLED' === t.status || 'PARTIAL_CANCELLED' === t.status,
          n = 'FAILED' === t.status
        if (o) return { success: !0, payment: t }
        if (r) return { success: !1, error: 'Payment was cancelled', payment: t }
        if (n) return { success: !1, error: 'Payment failed', payment: t }
        return { success: !1, error: `Payment is in ${String(t.status)} status`, payment: t }
      } catch (e) {
        return (
          console.error('[PortOne] Failed to verify payment status:', e),
          { success: !1, error: e instanceof Error ? e.message : 'Unknown error' }
        )
      }
    }
    async function tG(e) {
      try {
        return await tL.payment.preRegisterPayment({
          paymentId: e.paymentId,
          totalAmount: e.totalAmount,
          currency: e.currency || 'KRW',
        })
      } catch (e) {
        throw (console.error('[PortOne] Failed to pre-register payment:', e), e)
      }
    }
    e.s(
      [
        'cancelPayment',
        () => tv,
        'getPaymentDetails',
        () => tz,
        'portoneClient',
        () => tL,
        'preRegisterPayment',
        () => tG,
        'verifyPaymentStatus',
        () => tB,
      ],
      378725
    )
  },
]

//# sourceMappingURL=src_lib_portone-server_ts_7edfcdf0._.js.map
