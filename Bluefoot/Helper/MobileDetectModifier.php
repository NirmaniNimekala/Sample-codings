<?php
namespace ISM\Bluefoot\Helper;
use ISM\Bluefoot\Helper\MobileDetect;
/**
 * Helper to be used for mobile detect and validations
 *
 * Class Validations
 * @package Eadesigndev\Detect\Helper
 */
class MobileDetectModifier extends MobileDetect
{
    /**
     * MobileDetectModifier constructor.
     * @param null $headers
     * @param null $userAgent
     */
    public function __construct(
        $headers = null,
        $userAgent = null
    ) {
        if (!is_array($headers)) {
            $headers = [];
        }
        parent::__construct($headers, $userAgent);
    }
}
