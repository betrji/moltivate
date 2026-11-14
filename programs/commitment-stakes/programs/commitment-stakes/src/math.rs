//! Integer-only building blocks. Settlement policy awaits the source MVP.

pub const BPS: u16 = 10_000;

/// Contribution in half-workout units, avoiding fractional-workout truncation.
/// For target 3, the cap is exactly 4.5 workouts (9 half units).
pub fn capped_workout_units(accepted: u32, target: u32) -> Option<u64> {
    if target == 0 {
        return None;
    }
    Some((u64::from(accepted) * 2).min(u64::from(target) * 3))
}

/// Floor a basis-point proportion using a wide intermediate.
pub fn floor_bps(amount: u64, bps: u16) -> Option<u64> {
    if bps > BPS {
        return None;
    }
    u64::try_from(u128::from(amount) * u128::from(bps) / u128::from(BPS)).ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cap_preserves_odd_target_precision() {
        assert_eq!(capped_workout_units(4, 3), Some(8));
        assert_eq!(capped_workout_units(5, 3), Some(9));
        assert_eq!(capped_workout_units(u32::MAX, 3), Some(9));
        assert_eq!(capped_workout_units(0, 3), Some(0));
        assert_eq!(capped_workout_units(1, 0), None);
    }

    #[test]
    fn cap_handles_maximum_input() {
        assert_eq!(capped_workout_units(u32::MAX, u32::MAX), Some(u64::from(u32::MAX) * 2));
    }

    #[test]
    fn basis_points_floor_and_reject_out_of_range() {
        assert_eq!(floor_bps(101, 300), Some(3));
        assert_eq!(floor_bps(100, 2000), Some(20));
        assert_eq!(floor_bps(u64::MAX, BPS), Some(u64::MAX));
        assert_eq!(floor_bps(u64::MAX, 0), Some(0));
        assert_eq!(floor_bps(1, BPS + 1), None);
    }
}
