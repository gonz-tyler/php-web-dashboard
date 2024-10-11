<?php
class Car
{
    public $CAR_ID;
    public $CAR_TYPE;
    public $RED_CAR;
    public $CAR_AGE;
    public $DRIVER_ID;

    public function __construct($carId, $carType, $redCar, $carAge, $driverId)
    {
        $this->CAR_ID = $carId;
        $this->CAR_TYPE = $carType;
        $this->RED_CAR = $redCar;
        $this->CAR_AGE = $carAge;
        $this->DRIVER_ID = $driverId;
    }

    public function getCarId()
    {
        return $this->CAR_ID;
    }

    public function getCarType()
    {
        return $this->CAR_TYPE;
    }

    public function getRedCar()
    {
        return $this->RED_CAR;
    }

    public function getCarAge()
    {
        return $this->CAR_AGE;
    }

    public function getDriverId()
    {
        return $this->DRIVER_ID;
    }
}
?>
