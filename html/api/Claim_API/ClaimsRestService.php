<?php
require "dbinfo.php";
require "RestService.php";
require "Claim.php"; // Assuming you have a Claim class defined

class ClaimsRestService extends RestService 
{
    private $claims;
    
    public function __construct() 
    {
        parent::__construct("claims"); // Adjust the resource name if needed
    }

    public function performGet($url, $parameters, $requestBody, $accept) 
    {
        switch (count($parameters))
        {
            case 1:
                header('Content-Type: application/json; charset=utf-8');
                header('no-cache,no-store');
                $this->getAllClaims();
                echo json_encode($this->claims);
                break;

            case 2:
                $id = $parameters[1];
                $claim = $this->getClaimById($id);
                if ($claim != null)
                {
                    header('Content-Type: application/json; charset=utf-8');
                    header('no-cache,no-store');
                    echo json_encode($claim);
                }
                else
                {
                    $this->notFoundResponse();
                }
                break;
            case 3:
                $driverId = $parameters[2];
                $claims = $this->getClaimByDriverId($driverId);
                if (!empty($claims))
                {
                    header('Content-Type: application/json; charset=utf-8');
                    header('no-cache,no-store');
                    echo json_encode($claims);
                }
                else
                {
                    $this->notFoundResponse();
                }
                break;

            default:
                $this->methodNotAllowedResponse();
        }
    }

    public function performPost($url, $parameters, $requestBody, $accept) 
    {
        global $dbserver, $dbusername, $dbpassword, $dbdatabase;

        $newClaim = $this->extractClaimFromJSON($requestBody);
        $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
        if (!$connection->connect_error)
        {
            // Adjust the SQL query to insert into the claim table
            $sql = "INSERT INTO claims (CLAIM_ID, OLDCLAIM, CLM_FREQ, CLM_AMT, CLAIM_FLAG, CLM_KIDSDRIV, CLM_AGE, CLM_INCOME, CLM_STATUS, CLM_EDUCATION, CLM_OCCUPATION, DRIVER_ID, CAR_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $statement = $connection->prepare($sql);
	    $claimId = $newClaim->getClaimId();
	    $oldClaim = $newClaim->getOldClaim();
	    $claimFrequency = $newClaim->getClaimFrequency();
	    $claimAmount = $newClaim->getClaimAmount();
	    $claimFlag = $newClaim->getClaimFlag();
	    $claimKidsDrive = $newClaim->getClaimKidsDrive();
	    $claimAge = $newClaim->getClaimAge();
	    $claimIncome = $newClaim->getClaimIncome();
	    $claimMStatus = $newClaim->getClaimMStatus();
	    $claimEducation = $newClaim->getClaimEducation();
	    $claimOccupation = $newClaim->getClaimOccupation();
	    $driverId = $newClaim->getDriverId();
	    $carId = $newClaim->getCarId();
            // Extract values from the newClaim object and bind them to the SQL statement
            $statement->bind_param('ididiiidissii', $claimId, $oldClaim, $claimFrequency, $claimAmount, $claimFlag, $claimKidsDrive, $claimAge, $claimIncome, $claimMStatus, $claimEducation, $claimOccupation, $driverId, $carId);
            $result = $statement->execute();
            if ($result == FALSE)
            {
                $errorMessage = $statement->error;
            }
            $statement->close();
            $connection->close();
            if ($result == TRUE)
            {
                $this->noContentResponse();
            }
            else
            {
                $this->errorResponse($errorMessage);
            }
        }
    }

    public function performPut($url, $parameters, $requestBody, $accept) 
    {
        global $dbserver, $dbusername, $dbpassword, $dbdatabase;

        $newClaim = $this->extractClaimFromJSON($requestBody);
        $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
        if (!$connection->connect_error)
        {
            // Adjust the SQL query to update the claim table
            $sql = "UPDATE claims SET OLDCLAIM = ?, CLM_FREQ = ?, CLM_AMT = ?, CLAIM_FLAG = ?, CLM_KIDSDRIV = ?, CLM_AGE = ?, CLM_INCOME = ?, CLM_STATUS = ?, CLM_EDUCATION = ?, CLM_OCCUPATION = ?, DRIVER_ID = ?, CAR_ID = ? WHERE CLAIM_ID = ?";
            $statement = $connection->prepare($sql);
            // Extract values from the newClaim object and bind them to the SQL statement
            $statement->bind_param('didiiidissiii', $newClaim->getOldClaim(), $newClaim->getClaimFrequency(), $newClaim->getClaimAmount(), $newClaim->getClaimFlag(), $newClaim->getClaimKidsDrive(), $newClaim->getClaimAge(), $newClaim->getClaimIncome(), $newClaim->getClaimMStatus(), $newClaim->getClaimEducation(), $newClaim->getClaimOccupation(), $newClaim->getDriverId(), $newClaim->getCarId(), $newClaim->getClaimId());
            $result = $statement->execute();
            if ($result == FALSE)
            {
                $errorMessage = $statement->error;
            }
            $statement->close();
            $connection->close();
            if ($result == TRUE)
            {
                $this->noContentResponse();
            }
            else
            {
                $this->errorResponse($errorMessage);
            }
        }
    }

    public function performDelete($url, $parameters, $requestBody, $accept) 
    {
        global $dbserver, $dbusername, $dbpassword, $dbdatabase;

        if (count($parameters) == 2)
        {
            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $id = $parameters[1];
                $sql = "DELETE FROM claims WHERE CLAIM_ID = ?";
                $statement = $connection->prepare($sql);
                $statement->bind_param('i', $id);
                $result = $statement->execute();
                if ($result == FALSE)
                {
                    $errorMessage = $statement->error;
                }
                $statement->close();
                $connection->close();
                if ($result == TRUE)
                {
                    $this->noContentResponse();
                }
                else
                {
                    $this->errorResponse($errorMessage);
                }
            }
        }
    }

    private function getAllClaims()
    {
        global $dbserver, $dbusername, $dbpassword, $dbdatabase;

        $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
        if (!$connection->connect_error)
        {
            $query = "SELECT CLAIM_ID, OLDCLAIM, CLM_FREQ, CLM_AMT, CLAIM_FLAG, CLM_KIDSDRIV, CLM_AGE, CLM_INCOME, CLM_STATUS, CLM_EDUCATION, CLM_OCCUPATION, DRIVER_ID, CAR_ID FROM claims";
            if ($result = $connection->query($query))
            {
                while ($row = $result->fetch_assoc())
                {
                    $this->claims[] = new Claim($row["CLAIM_ID"], $row["OLDCLAIM"], $row["CLM_FREQ"], $row["CLM_AMT"], $row["CLAIM_FLAG"], $row["CLM_KIDSDRIV"], $row["CLM_AGE"], $row["CLM_INCOME"], $row["CLM_STATUS"], $row["CLM_EDUCATION"], $row["CLM_OCCUPATION"], $row["DRIVER_ID"], $row["CAR_ID"]);
                }
                $result->close();
            }
            $connection->close();
        }
    }   

    private function getClaimById($id)
    {
        global $dbserver, $dbusername, $dbpassword, $dbdatabase;

        $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
        if (!$connection->connect_error)
        {
            $query = "SELECT OLDCLAIM, CLM_FREQ, CLM_AMT, CLAIM_FLAG, CLM_KIDSDRIV, CLM_AGE, CLM_INCOME, CLM_STATUS, CLM_EDUCATION, CLM_OCCUPATION, DRIVER_ID, CAR_ID FROM claims WHERE CLAIM_ID = ?";
            $statement = $connection->prepare($query);
            $statement->bind_param('i', $id);
            $statement->execute();
            $statement->store_result();
            $statement->bind_result($oldClaim, $claimFrequency, $claimAmount, $claimFlag, $claimKidsDrive, $claimAge, $claimIncome, $claimMStatus, $claimEducation, $claimOccupation, $driverId, $carId);
            if ($statement->fetch())
            {
                return new Claim($id, $oldClaim, $claimFrequency, $claimAmount, $claimFlag, $claimKidsDrive, $claimAge, $claimIncome, $claimMStatus, $claimEducation, $claimOccupation, $driverId, $carId);
            }
            else
            {
                return null;
            }
            $statement->close();
            $connection->close();
        }
    }

private function getClaimByDriverId($driverId)
{
    global $dbserver, $dbusername, $dbpassword, $dbdatabase;

    $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
    if (!$connection->connect_error)
    {
        $query = "SELECT CLAIM_ID, OLDCLAIM, CLM_FREQ, CLM_AMT, CLAIM_FLAG, CLM_KIDSDRIV, CLM_AGE, CLM_INCOME, CLM_STATUS, CLM_EDUCATION, CLM_OCCUPATION, DRIVER_ID, CAR_ID FROM claims WHERE DRIVER_ID = ?";
        $statement = $connection->prepare($query);
        $statement->bind_param('i', $driverId);
        $statement->execute();
        $result = $statement->get_result();

        $claims = array();
        while ($row = $result->fetch_assoc())
        {
            $claim = new Claim($row['CLAIM_ID'], $row['OLDCLAIM'], $row['CLM_FREQ'], $row['CLM_AMT'], $row['CLAIM_FLAG'], $row['CLM_KIDSDRIV'], $row['CLM_AGE'], $row['CLM_INCOME'], $row['CLM_STATUS'], $row['CLM_EDUCATION'], $row['CLM_OCCUPATION'], $row['DRIVER_ID'], $row['CAR_ID']);
            $claims[] = $claim;
        }
        $statement->close();
        $connection->close();

        return $claims;
//        if ($result->num_rows > 0) {
//            while ($row = $result->fetch_assoc()) {
//                $claim = new Claim($row['CLAIM_ID'], $row['OLDCLAIM'], $row['CLM_FREQ'], $row['CLM_AMT'], $row['CLAIM_FLAG'], $row['CLM_KIDSDRIV'], $row['CLM_AGE'], $row['CLM_INCOME'], $row['CLM_STATUS'], $row['CLM_EDUCATION'], $row['CLM_OCCUPATION'], $row['DRIVER_ID'], $row['CAR_ID']);
//                $claims[] = $claim;
//            }
//        }
//
//        $statement->close();
//        $connection->close();
//
//        return $claims;
//    } else {
//        return array();
    }
}


    private function extractClaimFromJSON($requestBody)
    {
        $claimArray = json_decode($requestBody, true);
        $claim = new Claim($claimArray['CLAIM_ID'], 
                             $claimArray['OLDCLAIM'], 
                             $claimArray['CLM_FREQ'], 
                             $claimArray['CLM_AMT'], 
                             $claimArray['CLAIM_FLAG'], 
                             $claimArray['CLM_KIDSDRIV'], 
                             $claimArray['CLM_AGE'], 
                             $claimArray['CLM_INCOME'], 
                             $claimArray['CLM_STATUS'], 
                             $claimArray['CLM_EDUCATION'], 
                             $claimArray['CLM_OCCUPATION'], 
                             $claimArray['DRIVER_ID'], 
                             $claimArray['CAR_ID']);
        unset($claimArray);
        return $claim;
    }
}
?>
