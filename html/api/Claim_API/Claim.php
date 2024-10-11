<?php
class Claim
{
    public $CLAIM_ID;
    public $OLDCLAIM;
    public $CLM_FREQ;
    public $CLM_AMT;
    public $CLAIM_FLAG;
    public $CLM_KIDSDRIV;
    public $CLM_AGE;
    public $CLM_INCOME;
    public $CLM_STATUS;
    public $CLM_EDUCATION;
    public $CLM_OCCUPATION;
    public $DRIVER_ID;
    public $CAR_ID;

    public function __construct($claimId, $oldClaim, $claimFrequency, $claimAmount, $claimFlag, $claimKidsDrive, $claimAge, $claimIncome, $claimMStatus, $claimEducation, $claimOccupation, $driverId, $carId)
    {
        $this->CLAIM_ID = $claimId;
        $this->OLDCLAIM = $oldClaim;
	$this->CLM_FREQ = $claimFrequency;
	$this->CLM_AMT = $claimAmount;
	$this->CLAIM_FLAG = $claimFlag;
        $this->CLM_KIDSDRIV = $claimKidsDrive;
        $this->CLM_AGE = $claimAge;
        $this->CLM_INCOME = $claimIncome;
        $this->CLM_STATUS = $claimMStatus;
        $this->CLM_EDUCATION = $claimEducation;
        $this->CLM_OCCUPATION = $claimOccupation;
	$this->DRIVER_ID = $driverId;
	$this->CAR_ID = $carId;
    }

    public function getClaimId()
    {
        return $this->CLAIM_ID;
    }

    public function getOldClaim()
    {
        return $this->OLDCLAIM;
    }

    public function getClaimFrequency()
    {
        return $this->CLM_FREQ;
    }

    public function getClaimAmount()
    {
        return $this->CLM_AMT;
    }

    public function getClaimFlag()
    {
        return $this->CLAIM_FLAG;
    }

    public function getClaimKidsDrive()
    {
        return $this->CLM_KIDSDRIV;
    }

    public function getClaimAge()
    {
        return $this->CLM_AGE;
    }

    public function getClaimIncome()
    {
        return $this->CLM_INCOME;
    }

    public function getClaimMStatus()
    {
        return $this->CLM_STATUS;
    }

    public function getClaimEducation()
    {
        return $this->CLM_EDUCATION;
    }

    public function getClaimOccupation()
    {
        return $this->CLM_OCCUPATION;
    }

    public function getDriverId()
    {
	return $this->DRIVER_ID;
    }

    public function getCarId()
    {
	return $this->CAR_ID;
    }
}
?>
