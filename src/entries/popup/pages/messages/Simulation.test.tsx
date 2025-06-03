import { formatUnits } from '@ethersproject/units';
import { describe, expect, test } from 'vitest';

import { i18n } from '~/core/languages';
import { createNumberFormatter } from '~/core/utils/formatNumber';

const { format: formatNumber } = createNumberFormatter({
  notation: 'compact',
});

const mockAsset = {
  decimals: 18,
  symbol: 'USDC',
};

function getApprovalDisplayText(quantity: string | 'UNLIMITED') {
  return quantity === 'UNLIMITED' || +quantity > 999e12
    ? i18n.t('approvals.unlimited')
    : formatNumber(formatUnits(quantity, mockAsset.decimals));
}

describe('Approval Display Logic', () => {
  test('should display "Unlimited" for UNLIMITED quantity', () => {
    const result = getApprovalDisplayText('UNLIMITED');
    expect(result).toBe(i18n.t('approvals.unlimited'));
  });

  test('should display "0" for zero quantity', () => {
    const result = getApprovalDisplayText('0');
    expect(result).toBe('0');
  });

  test('should display "Unlimited" for very large values (>999T)', () => {
    const largeValue = '1000000000000000';
    const result = getApprovalDisplayText(largeValue);
    expect(result).toBe(i18n.t('approvals.unlimited'));
    expect(+largeValue > 999e12).toBe(true);
  });

  test('should display formatted value for normal amounts', () => {
    const normalValue = '1000000000000000000000';
    const result = getApprovalDisplayText(normalValue);
    expect(result).not.toBe(i18n.t('approvals.unlimited'));
    expect(+normalValue > 999e12).toBe(false);
  });

  test('should display formatted value for amounts just under 999T threshold', () => {
    const justUnderThreshold = '998000000000000';
    const result = getApprovalDisplayText(justUnderThreshold);
    expect(result).not.toBe(i18n.t('approvals.unlimited'));
    expect(+justUnderThreshold > 999e12).toBe(false);
  });

  test('should display "Unlimited" for amounts just over 999T threshold', () => {
    const justOverThreshold = '1000000000000000';
    const result = getApprovalDisplayText(justOverThreshold);
    expect(result).toBe(i18n.t('approvals.unlimited'));
    expect(+justOverThreshold > 999e12).toBe(true);
  });
});
